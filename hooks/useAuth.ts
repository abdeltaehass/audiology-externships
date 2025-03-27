"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const db = getFirestore();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to refresh user state from Firestore using query
  const refreshUser = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        console.log("🔄 Refreshing user state...");

        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          console.log("Firestore data:", userData);

          // Check and parse subscriber status
          const subscriberStatus = !!userData.subscriber;
          console.log("Subscriber status:", subscriberStatus);

          // Update subscription state based solely on 'subscriber'
          if (subscriberStatus) {
            console.log("✅ User is subscribed.");
            setIsSubscribed(true);
          } else {
            console.log("❌ User is not subscribed.");
            setIsSubscribed(false);
          }
        } else {
          console.log("⚠️ User document not found.");
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("❌ Error refreshing user data:", error);
        setIsSubscribed(false);
      }
    } else {
      console.log("❌ No authenticated user found.");
      setIsSubscribed(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("➡️ Auth state changed. Current user:", currentUser);
      setUser(currentUser);

      if (currentUser) {
        await refreshUser(); // Fetch subscription state on login
      } else {
        setIsSubscribed(false);
      }

      setLoading(false); // Set loading false only after user and subscription states are set
    });

    return () => unsubscribe();
  }, []);

  return { user, isSubscribed, loading, refreshUser };
}
