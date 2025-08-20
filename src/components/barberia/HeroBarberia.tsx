import React from "react";

type Props = {
  nombre?: string;
  hoverColor?: string; // 🎨 color dinámico desde Firestore
};

export default function HeroBarberia({
  nombre = "Mi Barbería",
  hoverColor = "#3b82f6", // fallback azul
}: Props) {
  return (
    <section
      className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/barberia-hero.jpg')" }}
    >
      <div className="bg-black bg-opacity-60 p-8 rounded-2xl text-center">
        <h2
          className="text-4xl md:text-6xl font-bold"
          style={{ color: hoverColor }}
        >
          {nombre}
        </h2>
        <p className="mt-4 text-lg text-white">
          Cortes modernos, clásicos y a tu medida
        </p>
        <a
          href="#reservar"
          className="mt-6 inline-block text-black px-6 py-3 rounded-xl font-semibold transition"
          style={{
            backgroundColor: hoverColor,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = darkenColor(hoverColor))
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = hoverColor)
          }
        >
          Reservar turno
        </a>
      </div>
    </section>
  );
}

// 🔽 Función auxiliar para oscurecer un poco el hover
function darkenColor(hex: string, amount = 0.15) {
  let col = hex.replace("#", "");
  if (col.length === 3) col = col.split("").map((c) => c + c).join("");

  const num = parseInt(col, 16);
  const r = Math.max(0, ((num >> 16) & 255) * (1 - amount));
  const g = Math.max(0, ((num >> 8) & 255) * (1 - amount));
  const b = Math.max(0, (num & 255) * (1 - amount));

  return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
}
