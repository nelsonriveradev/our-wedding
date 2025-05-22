// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYBuRvoR7HsfcL5Npg0jH2J_oLK-dp1pI",
  authDomain: "my-wedding-79433.firebaseapp.com",
  projectId: "my-wedding-79433",
  storageBucket: "my-wedding-79433.firebasestorage.app",
  messagingSenderId: "564253947920",
  appId: "1:564253947920:web:c663c1d37914c0036cf295",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app, "gs://my-wedding-79433.firebasestorage.app");
const db = getFirestore(app);
const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // The signed-in user info.
    const user = result.user;
    console.log("User signed in: ", user);
    // You can access the Google Access Token if you need it.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;
    return user;
  } catch (error) {
    // Handle Errors here.
    console.error("Error signing in with Google: ", error);
    return null;
  }
};

const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export { app, auth, signInWithGoogle, signOutUser, storage, db };
