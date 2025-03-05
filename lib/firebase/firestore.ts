// import {
//   collection,
//   getDocs,
//   addDoc,
//   doc,
//   setDoc,
//   getDoc,
//   deleteDoc,
//   DocumentData,
// } from "firebase/firestore";
// import { db } from "./config";
// import { UserModel } from "@/types";

// export const getCollection = async (collectionName: string) => {
//   const querySnapshot = await getDocs(collection(db, collectionName));
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// export const addDocument = async <T extends object>(
//   collectionName: string,
//   data: T
// ) => {
//   return await addDoc(collection(db, collectionName), data);
// };

// export const getDocument = async (
//   collectionName: string,
//   id: string
// ) => {
//   const docRef = doc(db, collectionName, id);
//   const docSnap = await getDoc<>(docRef);
//   return docSnap.exists() ? docSnap.data() : null;
// };

// export const updateDocument = async <T extends object>(
//   collectionName: string,
//   id: string,
//   data: T
// ) => {
//   const docRef = doc(db, collectionName, id);
//   return await setDoc(docRef, data, { merge: true });
// };

// export const deleteDocument = async (collectionName: string, id: string) => {
//   const docRef = doc(db, collectionName, id);
//   return await deleteDoc(docRef);
// };

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";

export const getCollection = async <T extends DocumentData>(
  collectionName: string
): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => doc.data() as T);
};

export const addDocument = async <T extends DocumentData>({
  collectionName,
  data,
  path,
}: {
  collectionName: string;
  data: T;
  path?: string;
}): Promise<string> => {
  const collectionRef = collection(db, collectionName, path || "");
  const docRef = await addDoc(collectionRef, data);
  return docRef.id;
};

export const getDocument = async <T extends DocumentData>({
  collectionName,
  pathSegments,
}: {
  collectionName: string;
  pathSegments: string[];
}): Promise<T | null> => {
  const docRef = doc(db, collectionName, ...pathSegments);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as T) : null;
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T> // Accepts partial updates
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data, { merge: true });
};

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};
