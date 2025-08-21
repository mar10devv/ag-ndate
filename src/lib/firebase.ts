// src/lib/firebase.ts
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
} from "firebase/auth";

// ⚡️ Configuración de Firebase (manteniendo el authDomain original de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyDMfXjFrcsO_aW53BCcfIMgfZd7gMGf9Jk",
  authDomain: "agendate-4b2c3.firebaseapp.com", // 👈 este debe ser el dominio oficial de Firebase
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

// 👇 Intentar guardar sesión en localStorage, si falla usar sessionStorage
setPersistence(auth, browserLocalPersistence).catch(async (err) => {
  console.warn("⚠️ LocalPersistence no disponible, usando Session:", err);
  await setPersistence(auth, browserSessionPersistence);
});

// Proveedor de Google
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
