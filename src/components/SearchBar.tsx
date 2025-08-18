// src/components/SearchBar.tsx
import React, { useRef, useState } from "react";
import CalendarPopover from "./CalendarPopover";
import type { CalendarPopoverHandle } from "./CalendarPopover";

export default function SearchBar() {
  // Estado compartido
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");   // ISO yyyy-MM-dd
  const [time, setTime] = useState("");

  // Refs separados (uno para cada layout, así no chocan)
  const calRefMobile = useRef<CalendarPopoverHandle>(null);
  const calRefDesktop = useRef<CalendarPopoverHandle>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      ...(service && { q: service }),
      ...(location && { loc: location }),
      ...(date && { date }),
      ...(time && { time }),
    });
    window.location.href = `/buscar?${params.toString()}`;
  }

  const inputBase =
    "w-full min-w-0 bg-transparent outline-none text-sm text-neutral-900 placeholder-neutral-500 truncate";

  // ======= UI =======
  return (
    <form onSubmit={onSubmit} className="w-full">
      {/* ================== MOBILE (card limpia) ================== */}
      <div className="md:hidden mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
          <div className="space-y-3">
            {/* Servicio */}
            <label className="flex items-center gap-2 h-12 rounded-xl border border-neutral-300 bg-white px-4">
              <input
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Todos los tratamientos y servicios"
                className={inputBase}
                aria-label="Buscar servicios"
              />
            </label>

            {/* Ubicación */}
            <label className="flex items-center gap-2 h-12 rounded-xl border border-neutral-300 bg-white px-4">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ubicación actual"
                className={inputBase}
                aria-label="Ubicación"
              />
            </label>

            {/* Fecha + Momento (2 cols; 1 col en pantallas muy angostas) */}
            <div className="grid grid-cols-2 gap-3 [@media(max-width:360px)]:grid-cols-1">
              {/* Fecha */}
              <div
                className="flex items-center gap-2 h-12 rounded-xl border border-neutral-300 bg-white px-4 cursor-pointer select-none"
                onClick={() => calRefMobile.current?.toggle()}
                role="button"
                aria-label="Abrir calendario"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") calRefMobile.current?.toggle();
                }}
              >
                <CalendarPopover
                  ref={calRefMobile}
                  value={date}
                  onChange={(iso) => setDate(iso)}
                  label="Cualquier fecha"
                />
              </div>

              {/* Momento */}
              <label className="flex items-center gap-2 h-12 rounded-xl border border-neutral-300 bg-white px-4">
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`${inputBase} pr-6`}
                  aria-label="Momento del día"
                >
                  <option value="">En cualquier momento</option>
                  <option value="manana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </label>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* ================== DESKTOP (píldora blanca) ================== */}
      <div className="hidden md:block mx-auto w-full max-w-5xl">
        <div className="flex w-full items-center rounded-[999px] border border-neutral-200 bg-white shadow-sm pl-4 pr-2 h-14 overflow-visible">
          {/* Servicio (crece) */}
          <div className="flex items-center h-full px-2 flex-1 min-w-0">
            <input
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Todos los tratamientos y servicios"
              className={inputBase}
              aria-label="Buscar servicios"
            />
          </div>

          <div className="h-6 w-px bg-neutral-200 mx-2" />

          {/* Ubicación (crece) */}
          <div className="flex items-center h-full px-2 flex-1 min-w-0">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ubicación actual"
              className={inputBase}
              aria-label="Ubicación"
            />
          </div>

          <div className="h-6 w-px bg-neutral-200 mx-2" />

          {/* Fecha */}
          <div
            className="flex items-center h-full px-2 min-w-[170px] cursor-pointer select-none"
            onClick={() => calRefDesktop.current?.toggle()}
            role="button"
            aria-label="Abrir calendario"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") calRefDesktop.current?.toggle();
            }}
          >
            <CalendarPopover
              ref={calRefDesktop}
              value={date}
              onChange={(iso) => setDate(iso)}
              label="Cualquier fecha"
            />
          </div>

          <div className="h-6 w-px bg-neutral-200 mx-2" />

          {/* Momento */}
          <div className="flex items-center h-full px-2 min-w-[190px]">
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`${inputBase} pr-6`}
              aria-label="Momento del día"
            >
              <option value="">En cualquier momento</option>
              <option value="manana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
            </select>
          </div>

          {/* Botón */}
          <div className="pl-2">
            <button
              type="submit"
              className="h-10 rounded-full bg-black px-6 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
