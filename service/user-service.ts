// USER SERVICE
// This module handles user authentication and Firestore user profile management.
// It includes registration, login, logout, account deletion, auth state listener, and user data fetching.

import { auth, db } from "@/lib/firebase";
import { addDocument } from "@/lib/firebase/firestore";
import { UserModel } from "@/types";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import {
  collection,
  deleteDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

// Register a new user with Firebase Auth and create a corresponding user document in Firestore
export const registerUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Add user profile to Firestore
  await addDocument<UserModel>({
    collectionName: "users",
    data: {
      uid: userCredential.user.uid,
      name: userCredential.user.displayName || "",
      profileImage: userCredential.user.photoURL || "",
      email: userCredential.user.email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      subscriber: false,
      subscriptionId: "",
      expirationDate: null,
    },
  });

  return userCredential.user;
};

// Log in an existing user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Delete the currently authenticated user from both Firebase Auth and Firestore
export const deleteUser = async () => {
  try {
    const user = auth.currentUser;
    const uid = user?.uid;

    if (user) {
      // Delete user from Firebase Authentication
      await user.delete();

      // Delete user document from Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await deleteDoc(userDoc.ref);
      }
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Sign out the currently authenticated user
export const logoutUser = async () => {
  await signOut(auth);
};

// Listen for authentication state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get Firestore user profile data based on UID
export const getUserData = async (userId: string) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uid", "==", userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No user found with this email.");
    return null;
  }

  const userDoc = querySnapshot.docs[0];
  return userDoc.data() as UserModel;
};
