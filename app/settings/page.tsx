"use client"
import MaxWidthWrapper from "@/components/layout/max-width-wrapper";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, deleteUser } from "firebase/auth";
import { doc, deleteDoc, getFirestore, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
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

export default function Settings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      console.log(email);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      alert("Please confirm account deletion!!!");
      return;
    }
    
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userDocRef = doc(getFirestore(), "users", user.uid);
        await deleteDoc(userDocRef);
        await deleteUser(user);
        setAccountDeleted(true);
        setTimeout(() => router.push("/"), 3000);
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Error deleting account. Please logout and log back in to your account, and then try again.");
      }
    }
  };

  const handleCancelSubscription = async () => {
    const currentUser = auth.currentUser;

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

      if (querySnapshot.empty) {
        toast.error("User not found.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userDocId = userDoc.id;
      const subscriptionId = userDoc.data().subscriptionId;

      if (!subscriptionId || typeof subscriptionId !== "string") {
        toast.error("You have no active subscription.");
        return;
      }

      const cancelResponse = await cancelSubscription(userDocId);

      if (cancelResponse) {
        toast.success("Subscription canceled successfully.");
      } else {
        toast.error("Failed to cancel the subscription.");
      }
    } catch (error) {
      toast.error("Something went wrong while canceling the subscription.");
    }
  };

  const cancelSubscription = async (userDocId: string) => {
    try {
      const userDocRef = doc(db, "users", userDocId);
  
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
    <MaxWidthWrapper>
      <SiteHeader />
      <div className="max-w-4xl mx-auto p-6">
        {/* Account Settings Section */}
        {!accountDeleted ? (
          <>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Update Your Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="Enter your new email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium">New Password</label>
                    <Input id="password" type="password" placeholder="Enter your new password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={!email || !password}>Save Changes</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Delete Account</h2>
                <p className="mb-4 text-sm text-muted-foreground">Deleting your account is permanent. Please confirm to continue.</p>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="confirmDelete" checked={confirmDelete} onChange={() => setConfirmDelete(!confirmDelete)} className="h-4 w-4" />
                  <label htmlFor="confirmDelete" className="text-sm">I confirm account deletion</label>
                </div>
                <Button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteAccount} disabled={!confirmDelete}>Delete My Account</Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-bold mb-4">Your Account Has Been Deleted</h2>
              <p className="mb-4 text-sm text-muted-foreground">We're sorry to see you go. Your account and associated data have been permanently deleted.</p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push("/")}>Go to Home</Button>
            </CardContent>
          </Card>
        )}

        {/*Cancel Subscription Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Cancel Subscription</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Cancelling your subscription will remove access to externships. This will NOT delete your account.
            </p>

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
  );
}
