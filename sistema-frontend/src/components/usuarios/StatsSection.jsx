import StatCard from "./StatCard";

function StatsSection({ total = 1284, activos = 1150, inactivos = 134, pendientes = 12 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        label="Total Usuarios"
        value={total.toLocaleString()}
        icon="group"
        iconBgClass="bg-primary-fixed"
        iconTextClass="text-primary"
      />
      <StatCard
        label="Activos"
        value={activos.toLocaleString()}
        icon="check_circle"
        iconBgClass="bg-secondary-container"
        iconTextClass="text-secondary"
      />
      <StatCard
        label="Inactivos"
        value={inactivos.toLocaleString()}
        icon="block"
        iconBgClass="bg-error-container"
        iconTextClass="text-error"
      />
      <StatCard
        label="Pendientes"
        value={pendientes.toLocaleString()}
        icon="pending"
        iconBgClass="bg-tertiary-fixed"
        iconTextClass="text-tertiary"
      />
    </div>
  );
}

export default StatsSection;
