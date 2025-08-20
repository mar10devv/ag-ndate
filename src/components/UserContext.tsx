// src/context/UserContext.tsx
import { createContext, useContext } from "react";

const mockUser = {
  uid: "user123",
  rol: "empresario",
  empresaId: "barberstyle",
};

export const UserContext = createContext({ user: mockUser });

export const useUser = () => useContext(UserContext);
