import { useEffect, useState } from "react";
import { obtenerConfigNegocio, guardarConfigNegocio } from "../lib/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

// 🔨 función para crear slug a partir del nombre
function generarSlug(nombre: string) {
  return nombre
    .toLowerCase()
    .normalize("NFD") // elimina tildes
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-") // espacios y símbolos → "-"
    .replace(/(^-|-$)+/g, ""); // quita guiones extremos
}

export default function DashboardTemp() {
  const [user, setUser] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [estado, setEstado] = useState<
    "cargando" | "listo" | "guardando" | "sin-acceso"
  >("cargando");
  const [mensaje, setMensaje] = useState("");
  const [mostrarPaleta, setMostrarPaleta] = useState(false);

  const COLORES = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#0ea5e9",
    "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280", "#000000",
  ];

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (usuario) => {
      if (usuario) {
        console.log("✅ Usuario autenticado:", usuario.email);

        const userRef = doc(db, "Usuarios", usuario.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: usuario.uid,
            email: usuario.email,
            nombre: usuario.displayName || "",
            foto: usuario.photoURL || "",
            premium: false,
            plantilla: null,
            localesRecientes: [],
            ubicacion: null,
            creadoEn: new Date(),
          });
          setEstado("sin-acceso");
          setMensaje("🚫 No tienes acceso al panel.");
          return;
        }

        const data = snap.data();

        if (data?.premium) {
          console.log("🧑‍💼 Usuario premium detectado:", data.email);

          const negocioConfig = await obtenerConfigNegocio(usuario.uid);
          if (negocioConfig) {
            // 🔑 asegurar slug
            if (!negocioConfig.slug) {
              negocioConfig.slug = generarSlug(negocioConfig.nombre || "mi-negocio");
            }
            setUser(usuario);
            setConfig(negocioConfig);
            setEstado("listo");
          } else {
            console.warn("⚠️ No se encontró config, creando doc inicial en Negocios...");

            const negocioRef = doc(db, "Negocios", usuario.uid);
            const configInicial = {
              nombre: data.nombre || "Mi Negocio",
              slug: generarSlug(data.nombre || "mi-negocio"),
              plantilla: data.plantilla || "barberia",
              hoverColor: "#3b82f6",
              logoUrl: "",
              usarLogo: false,
              email: data.email,
            };

            await setDoc(negocioRef, configInicial);

            setUser(usuario);
            setConfig(configInicial);
            setEstado("listo");
          }
        } else {
          setEstado("sin-acceso");
          setMensaje("🚫 No tienes acceso al panel.");
        }
      } else {
        setEstado("sin-acceso");
        setMensaje("🔒 No has iniciado sesión.");
      }
    });

    return () => unsub();
  }, []);

  // 👉 generar slug cuando cambia el nombre
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    setConfig((prev: any) => {
      const newConfig = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "nombre") {
        newConfig.slug = generarSlug(value);
      }

      return newConfig;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("guardando");
    const ok = await guardarConfigNegocio(user.uid, config);
    if (ok) {
      setMensaje("✅ Cambios guardados correctamente.");
    } else {
      setMensaje("❌ Error al guardar.");
    }
    setEstado("listo");
  };

  if (estado === "cargando") return <p>Cargando usuario y configuración...</p>;
  if (estado === "sin-acceso") return <p className="text-red-600">{mensaje}</p>;
  if (!config) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Panel de {config.nombre}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 mb-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del negocio
          </label>
          <input
            name="nombre"
            value={config.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Color con paleta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color del hover
          </label>
          <button
            type="button"
            onClick={() => setMostrarPaleta(!mostrarPaleta)}
            className="flex items-center px-4 py-2 rounded-md border border-gray-300 shadow-sm"
            style={{ backgroundColor: config.hoverColor, color: "#fff" }}
          >
            Cambiar color
          </button>

          {mostrarPaleta && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {COLORES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setConfig((prev: any) => ({
                      ...prev,
                      hoverColor: color,
                    }));
                    setMostrarPaleta(false);
                  }}
                  className="w-10 h-10 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo URL
          </label>
          <input
            name="logoUrl"
            value={config.logoUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="usarLogo"
            checked={config.usarLogo}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">Usar logo en vez de texto</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plantilla
          </label>
          <select
            name="plantilla"
            value={config.plantilla}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="barberia">Barbería</option>
            <option value="peluqueria">Peluquería</option>
            <option value="tattoo">Tattoo</option>
          </select>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={estado === "guardando"}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {estado === "guardando" ? "Guardando..." : "Guardar cambios"}
          </button>

          {/* 🔗 Botón visitar web con slug */}
          {config?.plantilla && config?.slug && (
            <a
              href={`/${config.plantilla}/${config.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Visitar web
            </a>
          )}
        </div>

        {mensaje && <p className="text-sm text-gray-700 mt-4">{mensaje}</p>}
      </form>

      {/* 🔎 Vista previa */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Vista previa de tu plantilla</h2>

        <style>
          {`
            .preview a:hover,
            .preview button:hover,
            .preview .btn:hover {
              background-color: ${config.hoverColor};
              color: white;
              transition: background-color 0.3s ease;
            }
          `}
        </style>

        <div className="preview space-y-4 bg-gray-50 p-6 rounded-md border">
          <a href="#" className="inline-block px-4 py-2 border rounded">
            Ver servicios
          </a>
          <button className="btn px-4 py-2 border rounded">Reservar turno</button>
          <div className="card border p-4 rounded shadow-sm hover:shadow-md">
            Tarjeta promocional
          </div>
        </div>
      </div>
    </div>
  );
}
