import { db } from "@/lib/firebase";
import { SettingsDoc } from "@/types";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

export const getSettings = async () => {
  const settings = await getDocs(collection(db, "settings"));
  return settings.docs.map((doc) => ({
    docId: doc.id,
    ...doc.data(),
  }))[0] as SettingsDoc & { docId: string };
};

export const updateSettings = async (params: {
  docId: string;
  settings: Partial<SettingsDoc>;
}) => {
  const collectionRef = collection(db, "settings");
  const docRef = doc(collectionRef, params.docId);
  await updateDoc(docRef, params.settings);
};
