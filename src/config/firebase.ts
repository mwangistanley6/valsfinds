import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCc5ioxeD4aoSuivyiDTbtg6s5zCsBxaik",
  authDomain: "vals-b6045.firebaseapp.com",
  projectId: "vals-b6045",
  storageBucket: "vals-b6045.firebasestorage.app",
  messagingSenderId: "741266726490",
  appId: "1:741266726490:web:a757ba476421ff8828c263",
  measurementId: "G-BW0ZKYEG63"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };