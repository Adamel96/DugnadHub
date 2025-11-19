

import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getComments(postId: string) {
  try {
    const snap = await getDoc(doc(db, "dugnader", postId));

    if (!snap.exists()) {
      console.warn("⚠️ getComments: post not found");
      return [];
    }

    const data = snap.data();
    return data.comments || [];
  } catch (error) {
    console.error("❌ getComments error:", error);
    throw error;
  }
}


