import { useEffect, useState } from "react";
import { obtenerConfigNegocio } from "../lib/firestore";

export default function TestFirestore() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      console.log("🔍 Buscando configuración del negocio…");
      try {
        const config = await obtenerConfigNegocio("barberstyle");
        console.log("📦 Config recibida:", config);

        if (config) {
          setData(config);
        } else {
          setError("❌ No se encontró configuración para este negocio.");
        }
      } catch (err) {
        console.error("❌ Error de Firestore:", err);
        setError("❌ Error al conectarse con Firestore.");
      }
    }

    fetchData();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p className="text-gray-500">Cargando configuración…</p>;

  return (
    <div className="p-6 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Configuración del Negocio</h2>
      <ul className="space-y-1 text-sm text-zinc-800">
        <li><strong>Nombre:</strong> {data.nombre}</li>
        <li><strong>Email:</strong> {data.email}</li>
        <li><strong>Color hover:</strong> {data.hoverColor}</li>
        <li><strong>Usar logo:</strong> {data.usarLogo ? "Sí" : "No"}</li>
        <li><strong>Logo URL:</strong> {data.logoUrl || "No definido"}</li>
        <li><strong>Plantilla:</strong> {data.plantilla}</li>
      </ul>
    </div>
  );
}
