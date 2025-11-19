import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function createPost(data: any) {
  try {
    return await addDoc(collection(db, "dugnader"), {
      ...data,
      createdAt: serverTimestamp(),
      participants: [],
    });
  } catch (error) {
    console.error("❌ FEIL ved oppretting av post:", error);
    throw error;
  }
}
