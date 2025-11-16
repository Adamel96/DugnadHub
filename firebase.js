// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA81IIHcX6ZCONRAifIj1ESpCwfjS5ZB8w",
  authDomain: "dugnadhub-5e674.firebaseapp.com",
  projectId: "dugnadhub-5e674",
  storageBucket: "dugnadhub-5e674.firebasestorage.app",
  messagingSenderId: "520017838610",
  appId: "1:520017838610:web:8892320d7ce73e9ee0cecb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);