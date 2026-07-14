function UsuariosHeader({ filtroRol, setFiltroRol, onNuevoUsuario }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div>
        <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-on-surface">Gestión de Usuarios</h2>
        <p className="text-sm sm:text-base md:text-lg text-on-surface-variant mt-1">Administra los accesos y roles de la plataforma logística.</p>
      </div>
      <div className="flex gap-2 sm:gap-4">
        <div className="relative group">
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="appearance-none bg-surface border border-outline-variant rounded-lg px-3 py-2.5 sm:py-4 pr-10 text-sm sm:text-base font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value="">Filtrar por Rol</option>
            <option value="ADMIN">Administrador</option>
            <option value="OPERADOR">Operador</option>
            <option value="REPARTIDOR">Repartidor</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">filter_list</span>
        </div>
        <button
          onClick={onNuevoUsuario}
          className="flex items-center gap-1.5 sm:gap-2 bg-primary text-on-primary px-3 sm:px-7 py-2.5 sm:py-4 rounded-lg text-sm sm:text-base font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined">person_add</span>
          Nuevo Usuario
        </button>
      </div>
    </div>
  );
}

export default UsuariosHeader;
