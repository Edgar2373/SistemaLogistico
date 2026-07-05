import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";

import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Usuarios from "./pages/admin/Usuarios";
import Clientes from "./pages/admin/Clientes";
import Productos from "./pages/admin/Productos";
import Pedidos from "./pages/admin/Pedidos";
import Repartidores from "./pages/admin/Repartidores";
import Vehiculos from "./pages/admin/Vehiculos";
import Rutas from "./pages/admin/Rutas";
import Categorias from "./pages/admin/Categorias";
import Boletas from "./pages/admin/Boletas";
import Pagos from "./pages/admin/Pagos";
import EstadosPedido from "./pages/admin/EstadosPedido";
import AsignacionRepartidorVehiculo from "./pages/admin/AsignacionRepartidorVehiculo";
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

        <Route path="/admin" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<DashboardAdmin />} />
        </Route>
        <Route path="/usuarios" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<Usuarios />} />
        </Route>
        <Route path="/clientes" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<Clientes />} />
        </Route>
        <Route path="/productos" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<Productos />} />
        </Route>
        <Route path="/pedidos" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<Pedidos />} />
        </Route>
        <Route path="/repartidores" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<Repartidores />} />
        </Route>
        <Route path="/vehiculos" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<Vehiculos />} />
        </Route>
        <Route path="/rutas" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<Rutas />} />
        </Route>
        <Route path="/categorias" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<Categorias />} />
        </Route>
        <Route path="/boletas" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<Boletas />} />
        </Route>
        <Route path="/pagos" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<Pagos />} />
        </Route>
        <Route path="/estados-pedido" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<EstadosPedido />} />
        </Route>
        <Route path="/asignacion-repartidor-vehiculo" element={<PrivateRoute rolesPermitidos={adminRoles}><LayoutAdmin /></PrivateRoute>}>
          <Route index element={<AsignacionRepartidorVehiculo />} />
        </Route>

        <Route path="/repartidor" element={<PrivateRoute rolesPermitidos={["REPARTIDOR"]}><PanelRepartidor /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
