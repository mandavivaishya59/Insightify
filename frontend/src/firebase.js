// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmh2d91edm2R-3CiuTH7O2tUhTcyZJhBY",
  authDomain: "insightify-21026.firebaseapp.com",
  projectId: "insightify-21026",
  storageBucket: "insightify-21026.firebasestorage.app",
  messagingSenderId: "648546753364",
  appId: "1:648546753364:web:651e4d1d650e1d0d6c06c1",
  measurementId: "G-H2Q5HJRWCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Export the auth functions
export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };

export default app;
