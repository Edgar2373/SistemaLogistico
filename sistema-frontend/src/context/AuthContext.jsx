import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    const nombre = localStorage.getItem("nombre");
    const idUsuario = localStorage.getItem("idUsuario");

    if (token && rol && nombre && idUsuario) {
      setUser({ token, rol, nombre, idUsuario: Number(idUsuario) });
    }
    setLoading(false);
  }, []);

  const loginUser = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.rol);
    localStorage.setItem("nombre", data.nombre);
    localStorage.setItem("idUsuario", data.idUsuario);
    setUser({ token: data.token, rol: data.rol, nombre: data.nombre, idUsuario: Number(data.idUsuario) });
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