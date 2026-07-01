import MetricCard from "./MetricCard";

function MetricsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <MetricCard
        titulo="Pedidos Hoy"
        valor="24"
        tendencia="+12%"
        tendenciaIcono="trending_up"
        tendenciaColor="text-secondary"
        subtexto="Actualizado hace 5 min"
        icono="local_shipping"
        colorIcono="text-primary"
      />
      <MetricCard
        titulo="Entregas Pendientes"
        valor="8"
        tendencia="Crítico"
        tendenciaIcono="warning"
        tendenciaColor="text-error"
        subtexto="2 con retraso mayor a 1h"
        icono="pending_actions"
        colorIcono="text-tertiary"
      />
      <MetricCard
        titulo="Repartidores Disponibles"
        valor="5"
        subtexto="Zona metropolitana activa"
        icono="person_pin_circle"
        colorIcono="text-secondary"
      >
        <span className="text-on-surface-variant font-medium">de 12 total</span>
      </MetricCard>
    </div>
  );
}

export default MetricsSection;