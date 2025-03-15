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

export const registerUser = async (email: string, password: string) => {
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
      subscriber: false,
      subscriptionId: "", 
      expirationDate: null,
    },
  });
  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
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

export const deleteUser = async () => {
  try {
    const user = auth.currentUser;
    const uid = user?.uid;
    if (user) {
      await user.delete();
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

export const logoutUser = async () => {
  await signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

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
