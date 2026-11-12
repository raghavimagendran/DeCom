import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { firestoreDb } from "./BaseConfig";

interface UserProfile {
  name: string;
  email: string;
}
export const saveUserProfile = async (uid: string, { name, email }: UserProfile) => {
  await setDoc(doc(firestoreDb, "users", uid), {
    name,
    email,
    createdAt: serverTimestamp(),
  });
};