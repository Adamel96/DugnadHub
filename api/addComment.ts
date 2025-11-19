

import { db } from "@/firebase";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

export async function addComment(
  postId: string,
  comment: {
    uid: string;
    username: string;
    text: string;
  }
) {
  try {
    const ref = doc(db, "dugnader", postId);

    const newComment = {
      ...comment,
      id: Math.random().toString(36).substring(2),
      createdAt: serverTimestamp(),
    };

    await updateDoc(ref, {
      comments: arrayUnion(newComment),
    });

    return newComment;
  } catch (error) {
    console.error("❌ addComment error:", error);
    throw error;
  }
}

