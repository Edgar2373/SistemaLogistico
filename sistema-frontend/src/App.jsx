import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas de autenticación
import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";

// Páginas de admin
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Usuarios from "./pages/admin/Usuarios";
// Layout admin
import LayoutAdmin from "./components/layout/LayoutAdmin";


// Componente de ruta protegida
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ruta raíz: redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas (no requieren token) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas admin protegidas — envueltas en LayoutAdmin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <LayoutAdmin />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardAdmin />} />
        </Route>

        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <LayoutAdmin />
            </PrivateRoute>
          }
        >
          <Route index element={<Usuarios />} />
        </Route>
 

        {/* Ruta para repartidores */}
        <Route
          path="/repartidor"
          element={
            <PrivateRoute>
              <div className="p-8">
                <h1 className="text-3xl font-bold">Panel del Repartidor</h1>
                <p className="mt-4 text-gray-600">Tus pedidos asignados aparecerán aquí.</p>
              </div>
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;