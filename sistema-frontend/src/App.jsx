import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas de autenticación
import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";

// Páginas de admin
import DashboardAdmin from "./pages/admin/DashboardAdmin";


import Usuarios from "./pages/admin/Usuarios";
import Repartidores from "./pages/admin/Repartidores";

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

        {/* Rutas protegidas (requieren token) */}
        <Route
          element={
            <PrivateRoute>
              <DashboardAdmin />
            </PrivateRoute>
          }
<<<<<<< Updated upstream
        />

      
=======
        >
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/repartidores" element={<Repartidores />} />
        </Route>

>>>>>>> Stashed changes

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
