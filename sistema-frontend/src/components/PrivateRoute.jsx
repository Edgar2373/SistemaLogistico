import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

function PrivateRoute({ children, rolesPermitidos }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="mt-2 text-on-surface-variant">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
    if (user.rol === "REPARTIDOR") return <Navigate to="/repartidor" />;
    return <Navigate to="/admin" />;
  }

  return children;
}

export default PrivateRoute;