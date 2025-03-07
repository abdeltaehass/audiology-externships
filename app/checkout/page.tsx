"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Link from "next/link";

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

const CheckoutPage = () => {
  const amount = "1"; // Price for subscription

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
                      console.log("Order", order);
                      alert(`Payment successful! Order ID: ${order.id}`);
                      // Redirect to a success page
                      window.location.href = "/payment-success";
                    } catch (err) {
                      console.error("Payment capture failed", err);
                      alert("Payment capture failed. Please try again.");
                    }
                  } else {
                    console.error("Order is undefined.");
                    alert("An error occurred with your payment.");
                  }
                }}
                onError={(err) => {
                  console.error("PayPal Checkout onError", err);
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
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;