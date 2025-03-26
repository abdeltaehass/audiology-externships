// SETTINGS PAGE
/* Settings page that allows authenticated users to cancel their subscription 
via a confirmation dialog. It integrates with Firebase to update user 
subscription data and provides feedback using toast notifications.*/

"use client"

import MaxWidthWrapper from "@/components/layout/max-width-wrapper";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import ProtectedRoute from "@/components/protectedRoute";

export default function Settings() {
  // State to manage the visibility of the cancel confirmation dialog
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const router = useRouter();

  // Handles cancellation process when user confirms
  const handleCancelSubscription = async () => {
    const currentUser = auth.currentUser;

    // Ensure user is authenticated
    if (!currentUser) {
      toast.error("You must be logged in.");
      return;
    }

    setIsCancelDialogOpen(false);

    const userUid = currentUser.uid;
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("uid", "==", userUid));

    try {
      const querySnapshot = await getDocs(q);

      // If no user found in DB
      if (querySnapshot.empty) {
        toast.error("User not found.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userDocId = userDoc.id;
      const subscriptionId = userDoc.data().subscriptionId;

      // Check if the user has an active subscription
      if (!subscriptionId || typeof subscriptionId !== "string") {
        toast.error("You have no active subscription.");
        return;
      }

      // Proceed to cancel the subscription
      const cancelResponse = await cancelSubscription(userDocId);

      // Notify user of the result
      if (cancelResponse) {
        toast.success("Subscription canceled successfully.");
      } else {
        toast.error("Failed to cancel the subscription.");
      }
    } catch (error) {
      toast.error("Something went wrong while canceling the subscription.");
    }
  };

  // Function that updates Firestore to cancel the subscription
  const cancelSubscription = async (userDocId: string) => {
    try {
      const userDocRef = doc(db, "users", userDocId);

      // Update the user's document to reflect cancellation
      await updateDoc(userDocRef, {
        subscriber: false,
        subscriptionId: null,
        expirationDate: "",
      });

      console.log("Subscription canceled successfully.");
      return true;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      return false;
    }
  };

  return (
    <ProtectedRoute>
    <MaxWidthWrapper>
      <SiteHeader />
      <div className="max-w-4xl mx-auto p-6">
        {/* Cancel Subscription Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Cancel Subscription</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Cancelling your subscription will remove access to externships. This will NOT delete your account.
            </p>

            {/* Confirmation Dialog for Subscription Cancellation */}
            <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button className="mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white">
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel your subscription?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Go Back</AlertDialogCancel>
                  <Button
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                    onClick={handleCancelSubscription}
                  >
                    Confirm
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
    </ProtectedRoute>
  );
}
