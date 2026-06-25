import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  // Obtener token del localStorage
  const token = localStorage.getItem("token");

  // Si hay token, mostrar la página protegida
  // Si no hay token, redirigir al login
  return token
    ? children
    : <Navigate to="/login" />;  // Cambiado de "/" a "/login"
}

export default PrivateRoute;