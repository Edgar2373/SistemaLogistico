function UsuariosHeader({ onAddClick, roleFilter, onRoleFilterChange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold text-on-surface">Gestión de Usuarios</h2>
        <p className="text-body-lg text-on-surface-variant mt-1">Administra los accesos y roles de la plataforma logística.</p>
      </div>
      <div className="flex gap-4 items-center">
        {/* Selector de Rol */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer outline-none"
          >
            <option value="">Filtrar por Rol</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OPERADOR">OPERADOR</option>
            <option value="REPARTIDOR">REPARTIDOR</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
            filter_list
          </span>
        </div>

        {/* Botón Nuevo Usuario */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined">person_add</span>
          Nuevo Usuario
        </button>
      </div>
    </div>
  );
}

export default UsuariosHeader;
