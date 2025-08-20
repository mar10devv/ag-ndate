import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Leer configuración del negocio por UID del usuario
export async function obtenerConfigNegocio(uid: string) {
  try {
    const snap = await getDoc(doc(db, "Negocios", uid)); // 👈 usamos siempre UID
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.error("Error obteniendo config:", err);
    return null;
  }
}

// Guardar / actualizar configuración del negocio
export async function guardarConfigNegocio(uid: string, data: any) {
  try {
    await setDoc(doc(db, "Negocios", uid), data, { merge: true }); // 👈 también UID aquí
    return true;
  } catch (err) {
    console.error("Error guardando config:", err);
    return false;
  }
}
