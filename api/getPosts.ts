import { db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export async function getPosts() {
  try {
    const q = query(collection(db, "dugnader"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ FEIL ved henting av dugnader:", error);
    throw error;
  }
}
