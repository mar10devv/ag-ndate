// src/components/Navbar.tsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Link = { label: string; href: string };

const clientes: Link[] = [
  { label: "Iniciar sesión o registrarse", href: "/login" },
  { label: "Descargar la app", href: "/app" },
  { label: "Ayuda y servicio al cliente", href: "/ayuda" },
];

const negociosHref = "/negocios"; // “Para negocios”

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"es-ES" | "es-UY">("es-ES");

  // Ref que envuelve botón + dropdown (para detectar clicks fuera)
  const menuRef = useRef<HTMLDivElement>(null);

  // Evitar scroll detrás del sheet móvil
  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", mobileOpen);
  }, [mobileOpen]);

  // Cerrar con ESC
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

  // 🔐 Cerrar dropdown al hacer click/tap fuera
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
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-lg font-semibold tracking-tight">
            Agéndate
          </a>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Iniciar sesión
            </a>
            <a
              href={negociosHref}
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Registra tu negocio
            </a>

            {/* Dropdown “Menú” */}
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
                          <a
                            className="block rounded-md px-2 py-1.5 hover:bg-neutral-50"
                            href={l.href}
                          >
                            {l.label}
                          </a>
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

          {/* Botón hamburguesa (móvil) */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white cursor-pointer"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            ☰
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
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white cursor-pointer"
                  aria-label="Cerrar menú"
                >
                  ✕
                </button>
              </div>

              {/* Contenido móvil */}
              <div className="px-4 pb-6">
                <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
                  <div className="mb-2 text-sm font-semibold">Para clientes</div>
                  <ul className="space-y-1 text-sm">
                    {clientes.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          className="block rounded-md px-2 py-2 hover:bg-neutral-50"
                          onClick={() => setMobileOpen(false)}
                        >
                          {l.label}
                        </a>
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
