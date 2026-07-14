/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    const nombre = localStorage.getItem("nombre");
    const idUsuario = localStorage.getItem("idUsuario");
    const repartidorId = localStorage.getItem("repartidorId");

    if (token && rol && nombre && idUsuario) {
      return { token, rol, nombre, idUsuario: Number(idUsuario), repartidorId: repartidorId ? Number(repartidorId) : null };
    }
    return null;
  });
  const [loading] = useState(false);
  const loginUser = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.rol);
    localStorage.setItem("nombre", data.nombre);
    localStorage.setItem("idUsuario", data.idUsuario);
    if (data.repartidorId) {
      localStorage.setItem("repartidorId", data.repartidorId);
    } else {
      localStorage.removeItem("repartidorId");
    }
    setUser({ token: data.token, rol: data.rol, nombre: data.nombre, idUsuario: Number(data.idUsuario), repartidorId: data.repartidorId || null });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const hasRole = (rolesPermitidos) => {
    if (!user) return false;
    return rolesPermitidos.includes(user.rol);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
