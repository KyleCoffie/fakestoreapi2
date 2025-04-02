import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth

const firebaseConfig = {
    apiKey: "AIzaSyClCnGv2ogjWX-YaZ2U4owlx_LuCaZzCZg",
    authDomain: "e-commerceapp-de2d4.firebaseapp.com",
    projectId: "e-commerceapp-de2d4",
    storageBucket: "e-commerceapp-de2d4.firebasestorage.app",
    messagingSenderId: "634729148550",
    appId: "1:634729148550:web:cc7fe193799f2793b1e107"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize auth

export { db, auth }; // Export auth
