function ClientesHeader({ busqueda, setBusqueda, onNuevoCliente }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
      <div>
        <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Gestión de Clientes</h2>
        <p className="text-base sm:text-lg text-on-surface-variant mt-1">Administra tu base de datos de clientes y contactos logísticos.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            className="w-full sm:w-64 appearance-none bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button
          onClick={onNuevoCliente}
          className="flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-3 sm:px-7 sm:py-4 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined">person_add</span>
          <span className="hidden sm:inline">Nuevo Cliente</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>
    </div>
  );
}

export default ClientesHeader;
