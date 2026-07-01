import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";

import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Usuarios from "./pages/admin/Usuarios";
import Clientes from "./pages/admin/Clientes";
import Repartidores from "./pages/admin/Repartidores";

import PanelRepartidor from "./pages/repartidor/PanelRepartidor";
import LayoutAdmin from "./components/layout/LayoutAdmin";
import PrivateRoute from "./components/PrivateRoute";

const adminRoles = ["ADMIN", "OPERADOR"];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas admin protegidas */}
        <Route path="/admin" element={
          <PrivateRoute rolesPermitidos={adminRoles}>
            <LayoutAdmin />
          </PrivateRoute>}>
          <Route index element={<DashboardAdmin />} />
        </Route>

        <Route path="/usuarios" element={
          <PrivateRoute rolesPermitidos={adminRoles}>
            <LayoutAdmin />
          </PrivateRoute>}>
          <Route index element={<Usuarios />} />
        </Route>

        <Route path="/clientes" element={
          <PrivateRoute rolesPermitidos={adminRoles}>
            <LayoutAdmin />
          </PrivateRoute>}>
          <Route index element={<Clientes />} />
        </Route>

        <Route path="/repartidores" element={
          <PrivateRoute rolesPermitidos={adminRoles}>
            <LayoutAdmin />
          </PrivateRoute>}>
          <Route index element={<Repartidores />} />
        </Route>




    

        {/* Ruta repartidor */}
        <Route path="/repartidor" element={
          <PrivateRoute rolesPermitidos={["REPARTIDOR"]}>
            <PanelRepartidor />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
