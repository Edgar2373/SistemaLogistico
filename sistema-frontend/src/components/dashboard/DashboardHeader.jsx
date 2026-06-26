function DashboardHeader() {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface font-bold text-3xl">Dashboard General</h2>
        <p className="font-body-md text-on-surface-variant">Bienvenido de nuevo, esto es lo que está pasando hoy.</p>
      </div>
      <div className="flex gap-sm">
        <button className="flex items-center gap-2 px-4 py-3 px-md py-sm bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-[18px]">add</span> Nuevo Pedido
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;