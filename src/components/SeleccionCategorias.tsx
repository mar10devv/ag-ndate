import React, { useState } from "react";

const categorias = [
  { icono: "💇‍♂️", nombre: "Hair salon" },
  { icono: "💅", nombre: "Uñas" },
  { icono: "👁️", nombre: "Cejas y pestañas" },
  { icono: "💄", nombre: "Salón de belleza" },
  { icono: "✨", nombre: "Centro de medicina estética" },
  { icono: "🪒", nombre: "Barbería" },
  { icono: "💆", nombre: "Masajes" },
  { icono: "🧖", nombre: "Spa & sauna" },
  { icono: "🪒", nombre: "Centro de depilación" },
  { icono: "🎯", nombre: "Tattooing & piercing" },
  { icono: "🌞", nombre: "Tanning studio" },
  { icono: "🏋️", nombre: "Fitness & recovery" },
  { icono: "🦵", nombre: "Fisioterapia" },
  { icono: "➕", nombre: "Clínica" },
  { icono: "🐶", nombre: "Peluquería para mascotas" },
  { icono: "🔲", nombre: "Otros" },
];

export default function SeleccionCategorias() {
  const [abierto, setAbierto] = useState(false);
  const [seleccion, setSeleccion] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Botón */}
      <button
        type="button"
        className="w-full bg-gray-100 border border-gray-300 px-4 py-3 rounded-xl flex justify-between items-center hover:bg-gray-200"
        onClick={() => setAbierto(!abierto)}
      >
        {seleccion || "Seleccionar categoría"}
        <span>{abierto ? "▲" : "▼"}</span>
      </button>

      {/* Menú */}
      {abierto && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-4 grid grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <button
              key={cat.nombre}
              type="button"
              className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center transition"
              onClick={() => {
                setSeleccion(cat.nombre);
                setAbierto(false);
              }}
            >
              <span className="text-3xl">{cat.icono}</span>
              <span className="mt-2 text-sm font-medium text-gray-700 text-center">
                {cat.nombre}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}