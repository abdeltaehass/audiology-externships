import { auth, db } from "@/lib/firebase";
import { addDocument } from "@/lib/firebase/firestore";
import { UserModel } from "@/types/models";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

const registerUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await addDocument<UserModel>({
    collectionName: "users",
    data: {
      uid: userCredential.user.uid,
      name: userCredential.user.displayName || "",
      profileImage: userCredential.user.photoURL || "",
      email: userCredential.user.email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  });
  return userCredential.user;
};

const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const logoutUser = async () => {
  await signOut(auth);
};

const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

const getUserData = async (userId: string) => {
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

export const userService = {
  registerUser,
  loginUser,
  logoutUser,
  onAuthStateChange,
  getUserData,
};
