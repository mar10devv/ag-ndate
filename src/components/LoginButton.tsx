import React from "react";
import { signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function LoginButton() {
  const handleLogin = () => {
    signInWithRedirect(auth, googleProvider);
  };

  return (
    <button
      onClick={handleLogin}
      className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
    >
      Iniciar sesión
    </button>
  );
}
