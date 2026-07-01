function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div>
        <h2 className="text-on-surface font-bold text-2xl sm:text-3xl">Dashboard General</h2>
        <p className="text-base text-on-surface-variant">Bienvenido de nuevo, esto es lo que está pasando hoy.</p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-primary text-on-primary rounded-lg font-medium hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-[18px]">add</span> Nuevo Pedido
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;