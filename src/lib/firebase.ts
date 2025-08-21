// src/lib/firebase.ts
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth";

// ⚡️ Configuración que te dio Firebase (ajustada en storageBucket)
const firebaseConfig = {
  apiKey: "AIzaSyDMfXjFrcsO_aW53BCcfIMgfZd7gMGf9Jk",
  authDomain: "agendateya.netlify.app", // ✅ CORREGIDO
  projectId: "agendate-4b2c3",
  storageBucket: "agendate-4b2c3.appspot.com",
  messagingSenderId: "961632832785",
  appId: "1:961632832785:web:eca2dc4f2773c0546c50b0",
  measurementId: "G-MFS0MZTQJN",
};


// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// 👇 esto asegura que la sesión se guarde en localStorage
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Error configurando persistencia:", err);
});

// Proveedor de Google
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);