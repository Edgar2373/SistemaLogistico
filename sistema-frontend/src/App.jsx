import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LayoutAdmin from "./components/layout/LayoutAdmin";
import PrivateRoute from "./components/PrivateRoute";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Repartidores from "./pages/admin/Repartidores";
import Usuarios from "./pages/admin/Usuarios";
import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";
import PanelRepartidor from "./pages/repartidor/PanelRepartidor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          element={
            <PrivateRoute>
              <LayoutAdmin />
            </PrivateRoute>
          }
        >
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/repartidores" element={<Repartidores />} />
        </Route>

        <Route
          path="/repartidor"
          element={
            <PrivateRoute>
              <PanelRepartidor />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
