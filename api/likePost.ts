
import { db } from "@/firebase";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

export async function toggleLike(postId: string, userId: string) {
  try {
    const ref = doc(db, "dugnader", postId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.error("❌ toggleLike: Post finnes ikke");
      return false;
    }

    const likes = snap.data().likes || [];
    const alreadyLiked = likes.includes(userId);

    await updateDoc(ref, {
      likes: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId),
    });

    return !alreadyLiked; // true = liket, false = unliket
  } catch (error) {
    console.error("❌ toggleLike error:", error);
    throw error;
  }
}
