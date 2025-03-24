// Setting Services
// This service module handles fetching and updating application-wide settings stored in Firestore.
// It is used for accessing configurations like the list of admin users or feature flags.

import { db } from "@/lib/firebase"; // Firebase Firestore instance
import { SettingsDoc } from "@/types"; // Type definition for the settings document
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

// Fetch the first (and typically only) settings document from the 'settings' collection
export const getSettings = async () => {
  const settings = await getDocs(collection(db, "settings")); // Fetch all documents in 'settings'
  return settings.docs.map((doc) => ({
    docId: doc.id,       // Attach the Firestore doc ID for later reference
    ...doc.data(),       // Spread the document data (cast later)
  }))[0] as SettingsDoc & { docId: string }; // Return the first settings doc with docId
};

// Update fields in the settings document
export const updateSettings = async (params: {
  docId: string;                        // ID of the settings document to update
  settings: Partial<SettingsDoc>;      // Settings fields to update (can be partial)
}) => {
  const collectionRef = collection(db, "settings");
  const docRef = doc(collectionRef, params.docId); // Get a reference to the specific settings doc
  await updateDoc(docRef, params.settings);        // Apply the updates to Firestore
};
