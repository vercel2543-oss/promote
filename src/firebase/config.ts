import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, query, where, orderBy, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyD8j0Y0G7c8EXjPEOv592MwFpqP3O4Bn-8",
  authDomain: "promote-b4836.firebaseapp.com",
  projectId: "promote-b4836",
  storageBucket: "promote-b4836.firebasestorage.app",
  messagingSenderId: "102722636633",
  appId: "1:102722636633:web:02f60d770c844744ac9a48",
  measurementId: "G-5ZB8RPFV8P"
};

// Initialize Firebase App instance safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
