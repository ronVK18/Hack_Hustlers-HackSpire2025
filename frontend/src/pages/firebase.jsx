// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD1USU6f1-olRjLKZKRoqnOMkATJS8w588",
    authDomain: "queuewisepro.firebaseapp.com",
    projectId: "queuewisepro",
    storageBucket: "queuewisepro.firebasestorage.app",
    messagingSenderId: "860159623390",
    appId: "1:860159623390:web:647bb622f2f0b368f9024f",
    measurementId: "G-34NE5T57TE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in components
export { auth, db, storage };
