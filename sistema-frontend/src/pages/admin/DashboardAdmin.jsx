/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getPedidos, getRepartidores, getVehiculos, getDetallesPedido } from "../../services/dashboardService";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import MetricsSection from "../../components/dashboard/MetricsSection";
import OrdersByStatusChart from "../../components/dashboard/OrdersByStatusChart";
import OrdersByDayChart from "../../components/dashboard/OrdersByDayChart";
import TopProductsChart from "../../components/dashboard/TopProductsChart";
import RecentOrdersTable from "../../components/dashboard/RecentOrdersTable";
import TopDriversTable from "../../components/dashboard/TopDriversTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function DashboardAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      const [p, r, v, d] = await Promise.all([getPedidos(), getRepartidores(), getVehiculos(), getDetallesPedido()]);
      setPedidos(p);
      setRepartidores(r);
      setVehiculos(v);
      setDetalles(d);
    } catch (err) {
      console.error("Error al cargar dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  if (loading) return <LoadingSpinner />;

  const hoyDate = new Date();
  const hoy = `${hoyDate.getFullYear()}-${String(hoyDate.getMonth() + 1).padStart(2, "0")}-${String(hoyDate.getDate()).padStart(2, "0")}`;

  const pedidosHoy = pedidos.filter(p => p.fechaRegistro === hoy);
  const pedidosPendientes = pedidos.filter(p => p.estadoPedido?.nombreEstado === "PENDIENTE");
  const pedidosEnRuta = pedidos.filter(p => p.estadoPedido?.nombreEstado === "EN_RUTA");
  const pedidosEntregados = pedidos.filter(p => p.estadoPedido?.nombreEstado === "ENTREGADO");
  const pedidosCancelados = pedidos.filter(p => p.estadoPedido?.nombreEstado === "CANCELADO");
  const repartidoresDisponibles = repartidores.filter(r => r.estadoRepartidor === "DISPONIBLE");
  const vehiculosActivos = vehiculos.filter(v => v.estadoVehiculo === "ACTIVO");

  return (
    <>
      <DashboardHeader />
      <MetricsSection
        pedidosHoy={pedidosHoy.length}
        pedidosPendientes={pedidosPendientes.length}
        pedidosEnRuta={pedidosEnRuta.length}
        pedidosEntregados={pedidosEntregados.length}
        pedidosCancelados={pedidosCancelados.length}
        repartidoresDisponibles={repartidoresDisponibles.length}
        repartidoresTotal={repartidores.length}
        vehiculosActivos={vehiculosActivos.length}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersByStatusChart
          pendientes={pedidosPendientes.length}
          enRuta={pedidosEnRuta.length}
          entregados={pedidosEntregados.length}
          cancelados={pedidosCancelados.length}
        />
        <OrdersByDayChart pedidos={pedidos} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart detalles={detalles} />
        <TopDriversTable pedidos={pedidos} repartidores={repartidores} />
      </div>
      <RecentOrdersTable pedidos={pedidos} />
    </>
  );
}

export default DashboardAdmin;
