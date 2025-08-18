import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../lib/firebase";
import LoginButton from "./LoginButton";

export default function UserAuthWidget() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) {
    return <span className="text-sm text-zinc-500">Cargando…</span>;
  }

  if (!user) {
    return <LoginButton />;
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src={user.photoURL ?? ""}
        alt={user.displayName ?? "Usuario"}
        className="h-8 w-8 rounded-full"
        referrerPolicy="no-referrer"
      />
      <span className="text-sm">{user.displayName ?? user.email}</span>
      <button
        onClick={() => signOut(auth)}
        className="rounded-xl border px-3 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
