import { createContext, useContext } from "react";

// Simulamos un usuario empresarial autenticado
const mockUser = {
  uid: "user123",
  rol: "empresario", // Cambia a "cliente" si quieres probar restricción
  empresaId: "barberstyle"
};

// Creamos el contexto con un valor por defecto
export const UserContext = createContext({ user: mockUser });

// Hook para usar el contexto en cualquier componente
export const useUser = () => useContext(UserContext);
