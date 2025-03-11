"use client";

import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { doc, updateDoc, Timestamp, getDocs, collection, query, where } from "firebase/firestore";
import { db, auth } from '@/lib/firebase/config';

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

const CheckoutPage = () => {
  const amount = "1"; // Price for subscription
  const user = useAuthStore((state) => state.user);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  const getUserDocumentId = async () => {
    const user = auth.currentUser;

    if (!user) {
      return null;
    }

    const usersCollectionRef = collection(db, 'users');
    // Query based on the uid
    const q = query(usersCollectionRef, where("uid", "==", user.uid));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        // This is the Firestore document ID
        return doc.id;
      } else {
      // This is when no doc is found
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const handleSubscription = async (orderId: string) => {
    const user = auth.currentUser;
  
    if (!user) {
      alert("You must be logged in to subscribe.");
      return;
    }

    try {
      const docId = await getUserDocumentId(); // Get the user document ID

      if (!docId) {
      // Skip if no document found
        return;
      }

      const userRef = doc(db, "users", docId); // Reference to the user document
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // Set expiration to 7 days from now
  
      // Update the user document
      await updateDoc(userRef, {
        subscriber: true,
        subscriptionId: orderId,
        expirationDate: Timestamp.fromDate(expirationDate),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      setHasSubscribed(true);
      //console.log("Subscription updated successfully.");
    } catch (error) {
      alert("Error subscribing. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="py-12 md:py-24 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center md:text-4xl">
            Checkout
          </h1>
          <p className="text-lg mt-4 text-center">
            You are about to subscribe to the Audiology Membership Plan for $1/week.
          </p>

          <div className="flex justify-center mt-12">
            <PayPalScriptProvider options={{ clientId: paypalClientId }}>
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect" }}
                createOrder={(data, actions) => {
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
                  if (actions.order) {
                    try {
                      const order = await actions.order.capture();
                      const orderId = order.id ?? "";
                      if (orderId === "") {
                        alert("Error: Order ID is missing.");
                        return;
                      }
                      await handleSubscription(orderId); // Update the subscription
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

          <div className="flex justify-center mt-8">
            <Link href="/">
              <button className="px-4 py-2 bg-gray-500 text-white rounded">
                Cancel
              </button>
            </Link>
          </div>

          {hasSubscribed && (
            <div className="mt-4 text-center text-green-600">
              <p>Your subscription was successful! Thank you for subscribing.</p><br/>
              <p>To unsubscribe, please go to the settings page and cancel your subscription.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
