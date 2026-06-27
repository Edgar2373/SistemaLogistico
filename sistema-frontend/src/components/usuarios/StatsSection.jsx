import StatCard from "./StatCard";

function StatsSection({ total, activos, inactivos, pendientes }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-7">
      <StatCard titulo="Total Usuarios" valor={total} icono="group" colorBg="bg-primary-fixed" colorText="text-primary" />
      <StatCard titulo="Activos" valor={activos} icono="check_circle" colorBg="bg-secondary-container" colorText="text-secondary" />
      <StatCard titulo="Inactivos" valor={inactivos} icono="block" colorBg="bg-error-container" colorText="text-error" />
      <StatCard titulo="Pendientes" valor={pendientes} icono="pending" colorBg="bg-tertiary-fixed" colorText="text-tertiary" />
    </div>
  );
}

export default StatsSection;