import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  onAuthStateChanged,
  signInWithRedirect,
  signInWithPopup,
  signOut,
  getRedirectResult,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

type Link = { label: string; href: string };

const clientes: Link[] = [
  { label: "Iniciar sesión o registrarse", href: "/login" },
  { label: "Descargar la app", href: "/app" },
  { label: "Ayuda y servicio al cliente", href: "/ayuda" },
];

const negociosHref = "/negocios";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"es-ES" | "es-UY">("es-ES");
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

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

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect login error:", error);
      })
      .finally(() => setCheckingAuth(false));

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCheckingAuth(false);
    });

    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      if (window.location.hostname === "localhost") {
        await signInWithPopup(auth, googleProvider);
      } else {
        await signInWithRedirect(auth, googleProvider);
      }
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
          <a href="/" className="text-lg font-semibold tracking-tight">
            Agéndate
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

            <a
              href={negociosHref}
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Registra tu negocio
            </a>

            {/* Dropdown menú */}
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

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl"
                  role="menu"
                >
                  {/* Tarjeta: Para clientes */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
                    <div className="mb-2 text-sm font-semibold">Para clientes</div>
                    <ul className="space-y-1 text-sm">
                      {clientes.map((l) => (
                        <li key={l.href}>
                          {l.href === "/login" ? (
                            <button
                              type="button"
                              className="cursor-pointer block w-full text-left rounded-md px-2 py-1.5 hover:bg-neutral-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLogin();
                              }}
                            >
                              {user ? "Mi cuenta" : l.label}
                            </button>
                          ) : (
                            <a
                              className="block rounded-md px-2 py-1.5 hover:bg-neutral-50"
                              href={l.href}
                            >
                              {l.label}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Idioma */}
                    <div className="my-3 h-px bg-neutral-200" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span aria-hidden>🌐</span>
                        <span>
                          {lang === "es-ES" ? "español (ES)" : "español (UY)"}
                        </span>
                      </div>
                      <select
                        aria-label="Seleccionar idioma"
                        value={lang}
                        onChange={(e) => setLang(e.target.value as any)}
                        className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs"
                      >
                        <option value="es-ES">español (ES)</option>
                        <option value="es-UY">español (UY)</option>
                      </select>
                    </div>
                  </div>

                  {/* Para negocios */}
                  <a
                    href={negociosHref}
                    className="mt-3 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm font-medium hover:bg-neutral-50"
                  >
                    <span>Para negocios</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Botón hamburguesa móvil */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white cursor-pointer"
            aria-label="Menú móvil"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Sheet móvil */}
      {mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[60]">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute inset-y-0 right-0 w-80 max-w-[88%] bg-white shadow-xl">
              <div className="flex items-center justify-between p-4">
                <span className="text-base font-semibold">Menú</span>
              </div>

              {/* Contenido móvil */}
              <div className="px-4 pb-6">
                <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
                  <div className="mb-2 text-sm font-semibold">Para clientes</div>
                  <ul className="space-y-1 text-sm">
                    {clientes.map((l) => (
                      <li key={l.href}>
                        {l.href === "/login" ? (
                          <button
                            type="button"
                            className="cursor-pointer block w-full text-left rounded-md px-2 py-2 hover:bg-neutral-50"
                            onClick={() => {
                              setMobileOpen(false);
                              handleLogin();
                            }}
                          >
                            {user ? "Mi cuenta" : l.label}
                          </button>
                        ) : (
                          <a
                            href={l.href}
                            className="block rounded-md px-2 py-2 hover:bg-neutral-50"
                            onClick={() => setMobileOpen(false)}
                          >
                            {l.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="my-3 h-px bg-neutral-200" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span aria-hidden>🌐</span>
                      <span>
                        {lang === "es-ES" ? "español (ES)" : "español (UY)"}
                      </span>
                    </div>
                    <select
                      aria-label="Seleccionar idioma"
                      value={lang}
                      onChange={(e) => setLang(e.target.value as any)}
                      className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs"
                    >
                      <option value="es-ES">español (ES)</option>
                      <option value="es-UY">español (UY)</option>
                    </select>
                  </div>
                </div>

                <a
                  href={negociosHref}
                  className="mt-3 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm font-medium hover:bg-neutral-50"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Para negocios</span>
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
