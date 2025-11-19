// firebase.js

// importerer nødvendige Firebase-moduler
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "520017838610-domr1fpg6le07e4hku5bmvafogahts1s.apps.googleusercontent.com",
});


// firebase config (bruk din eksisterende)
const firebaseConfig = {
  apiKey: "AIzaSyA81IIHcX6ZCONRAifIj1ESpCwfjS5ZB8w",
  authDomain: "dugnadhub-5e674.firebaseapp.com",
  projectId: "dugnadhub-5e674",
  storageBucket: "dugnadhub-5e674.firebasestorage.app",
  messagingSenderId: "520017838610",
  appId: "1:520017838610:web:8892320d7ce73e9ee0cecb",
};

// initialiser selve Firebase-appen
const app = initializeApp(firebaseConfig);

// initialiser auth med AsyncStorage for persistent login
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// firestore database
export const db = getFirestore(app);

// firebase Storage
export const storage = getStorage(app);
