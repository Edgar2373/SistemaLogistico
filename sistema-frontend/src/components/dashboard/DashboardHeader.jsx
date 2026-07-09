function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div>
        <h2 className="text-on-surface font-bold text-2xl sm:text-3xl">Dashboard General</h2>
        <p className="text-base text-on-surface-variant">LogiFlow Distribution - Panel de control de operaciones logísticas.</p>
      </div>
    </div>
  );
}

export default DashboardHeader;
