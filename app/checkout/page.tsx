// CHECKOUT PAGE
// This page handles PayPal payments and user subscription updates.
// After a successful transaction, it updates the user's Firestore document
// with a subscription ID and expiration date (7 days ahead), and provides
// navigation to the externships page.
"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { doc, updateDoc, Timestamp, getDocs, collection, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { SiteHeader } from "@/components/layout/site-header"; // Navigation header

// PayPal client ID from environment variables
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

const CheckoutPage = () => {
  const amount = "1"; // Subscription price in USD
  const user = useAuthStore((state) => state.user); // Get current user from auth store
  const [hasSubscribed, setHasSubscribed] = useState(false); // Tracks if user has successfully subscribed

  // Fetch the Firestore document ID for the current user
  const getUserDocumentId = async () => {
    const user = auth.currentUser;

    if (!user) return null;

    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where("uid", "==", user.uid));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return doc.id; // Return document ID
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
      return null;
    }
  };

  const [errorMessage, setErrorMessage] = useState(""); // State for login error message

const handleSubscription = async (orderId: string) => {
  const user = auth.currentUser;

  if (!user) {
    setErrorMessage("You must be logged in to subscribe. Please sign in or create an account.");
    return;
  }

  try {
    const docId = await getUserDocumentId();
    if (!docId) return;

    const userRef = doc(db, "users", docId);

    // Set subscription expiration date (7 days from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    // Update user document with subscription info
    await updateDoc(userRef, {
      subscriber: true,
      subscriptionId: orderId,
      expirationDate: Timestamp.fromDate(expirationDate),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    setHasSubscribed(true);
    setErrorMessage(""); // Clear any previous error message
  } catch (error) {
    setErrorMessage("Error subscribing. Please try again.");
  }
};

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
      <SiteHeader />
        <div className="py-12 md:py-24 max-w-6xl mx-auto">
          {/* Page Header */}
          <h1 className="text-3xl font-bold text-center md:text-4xl">
            Checkout
          </h1>
          <p className="text-lg mt-4 text-center">
            You are about to subscribe to the Audiology Membership Plan for $1/week.
          </p>

          {/* PayPal Button */}
          <div className="flex justify-center mt-12">
            <PayPalScriptProvider options={{ clientId: paypalClientId }}>
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect", height: 55 }}
                createOrder={(data, actions) => {
                  // Create order with PayPal
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: amount,
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  // Handle payment approval
                  if (actions.order) {
                    try {
                      const order = await actions.order.capture();
                      const orderId = order.id ?? "";
                      if (orderId === "") {
                        alert("Error: Order ID is missing.");
                        return;
                      }
                      await handleSubscription(orderId);
                    } catch (err) {
                      alert("Payment failed. Please try again.");
                    }
                  } else {
                    alert("An error occurred with your payment.");
                  }
                }}
                onError={(err) => {
                  alert(`Payment failed: ${err.message || "Please try again later."}`);
                }}
              />
            </PayPalScriptProvider>
          </div>

          {/* Cancel Button */}
          <div className="flex justify-center mt-8">
            <Link href="/">
              <button className="px-4 py-2 bg-gray-500 text-white rounded">
                Cancel
              </button>
            </Link>
          </div>

          {/* Success Message and Navigation after Subscription */}
        {hasSubscribed && (
          <div className="mt-6 p-6 text-center bg-green-100 border border-green-400 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-green-700">
              🎉 Subscription Successful!
            </h2>
            <p className="mt-2 text-green-700">
              Thank you for subscribing to the <strong>Audiology Membership Plan</strong>.  
              Your access is now active for the next 7 days.
            </p>
            <p className="mt-2 text-green-700">
              To manage or cancel your subscription, visit the <strong>Settings</strong> page.
            </p>

          {/* Button to navigate to Externships page */}
            <div className="mt-6">
              <Link href="/posts">
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
                  Explore Externships 🚀
                </button>
              </Link>
            </div>
        </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
