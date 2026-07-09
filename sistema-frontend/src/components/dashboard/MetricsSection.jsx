import MetricCard from "./MetricCard";

function MetricsSection({ pedidosHoy, pedidosPendientes, pedidosEnRuta, pedidosEntregados, pedidosCancelados, repartidoresDisponibles, repartidoresTotal, vehiculosActivos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <MetricCard
        titulo="Pedidos Hoy"
        valor={pedidosHoy}
        icono="local_shipping"
        colorIcono="text-primary"
        subtexto={`${pedidosEntregados} entregados hoy`}
      />
      <MetricCard
        titulo="Pendientes"
        valor={pedidosPendientes}
        icono="pending_actions"
        colorIcono="text-[#FFA000]"
        subtexto="Esperando asignación"
      />
      <MetricCard
        titulo="En Ruta"
        valor={pedidosEnRuta}
        icono="alt_route"
        colorIcono="text-[#1976D2]"
        subtexto="En camino a destino"
      />
      <MetricCard
        titulo="Entregados"
        valor={pedidosEntregados}
        icono="check_circle"
        colorIcono="text-[#43A047]"
        subtexto="Completados exitosamente"
      />
      <MetricCard
        titulo="Cancelados"
        valor={pedidosCancelados}
        icono="cancel"
        colorIcono="text-[#E53935]"
        subtexto="Pedidos cancelados"
      />
      <MetricCard
        titulo="Repartidores"
        valor={`${repartidoresDisponibles}/${repartidoresTotal}`}
        icono="person_pin_circle"
        colorIcono="text-secondary"
        subtexto="Disponibles de total"
      />
      <MetricCard
        titulo="Vehículos Activos"
        valor={vehiculosActivos}
        icono="local_shipping"
        colorIcono="text-tertiary"
        subtexto="En operación"
      />
      <MetricCard
        titulo="Total Pedidos"
        valor={pedidosHoy + pedidosPendientes + pedidosEnRuta + pedidosEntregados + pedidosCancelados}
        icono="inventory_2"
        colorIcono="text-primary"
        subtexto="Todos los registros"
      />
    </div>
  );
}

export default MetricsSection;
