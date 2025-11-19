import { storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(uri: string): Promise<string> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = `images/${Date.now()}-${Math.random()}.jpg`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("❌ FEIL ved bildeopplasting:", error);
    throw error; // send feilen videre til PostForm
  }
}
