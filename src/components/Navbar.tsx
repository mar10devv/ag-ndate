import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
  type User,
} from "firebase/auth";
import { auth, googleProvider, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const clientes = [
  { label: "Iniciar sesión o registrarse", href: "/login" },
  { label: "Descargar la app", href: "/app" },
  { label: "Ayuda y servicio al cliente", href: "/ayuda" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"es-ES" | "es-UY">("es-ES");
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", mobileOpen);
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // 👇 Revisar autenticación al montar
  useEffect(() => {
    console.log("🔎 Iniciando chequeo de autenticación...");

    const unsub = onAuthStateChanged(auth, async (u) => {
      console.log("📡 onAuthStateChanged fired. User:", u);
      setUser(u);
      setCheckingAuth(false);

      if (u) {
        try {
          const snap = await getDoc(doc(db, "Usuarios", u.uid));
          setIsPremium(snap.exists() ? snap.data()?.premium ?? false : false);
          console.log("✅ Datos Firestore cargados");
        } catch (err) {
          console.error("❌ Error al leer Firestore:", err);
        }
      } else {
        setIsPremium(null);
      }
    });

    return () => unsub();
  }, []);

  // 👇 handleLogin con logs
  const handleLogin = async () => {
    try {
      console.log("🚀 Intentando login...");
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Login result:", result.user);
    } catch (e) {
      console.error("[Navbar] login error:", e);
      alert(`No se pudo iniciar sesión: ${String((e as any)?.code || e)}`);
    }
  };

  const handleLogout = () => {
    signOut(auth).catch((e) => console.error("[Navbar] signOut error:", e));
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-[9999] bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="text-3xl font-bold lowercase tracking-tight text-neutral-900 font-inter"
          >
            agéndate
          </a>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-3">
            {checkingAuth ? (
              <span className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-500">
                Cargando…
              </span>
            ) : user ? (
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL ?? ""}
                  alt="Usuario"
                  className="h-8 w-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer rounded-full border border-neutral-300 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="cursor-pointer rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
              >
                Iniciar sesión
              </button>
            )}

            {/* 🔄 Dinámico según usuario */}
            {user ? (
              isPremium ? (
                <a
                  href="/panel"
                  className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
                >
                  Panel de control
                </a>
              ) : (
                <a
                  href="/registrar-negocio"
                  className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
                >
                  Registrar negocio
                </a>
              )
            ) : null}

            {/* Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50 cursor-pointer"
              >
                Menú ☰
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
