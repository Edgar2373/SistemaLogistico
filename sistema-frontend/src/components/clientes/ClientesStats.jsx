function ClientesStats({ total }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
      <div className="bg-white border border-outline-variant p-3 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-4 min-h-20">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
        </div>
        <div>
          <p className="text-sm font-medium text-on-surface-variant">Total Clientes</p>
          <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold">{total}</h4>
        </div>
      </div>
      <div className="bg-white border border-outline-variant p-3 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-4 min-h-20">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-container rounded-full flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <div>
          <p className="text-sm font-medium text-on-surface-variant">Activos</p>
          <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold">{total}</h4>
        </div>
      </div>
      <div className="bg-white border border-outline-variant p-3 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-4 min-h-20">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-error-container rounded-full flex items-center justify-center text-error">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_off</span>
        </div>
        <div>
          <p className="text-sm font-medium text-on-surface-variant">Inactivos</p>
          <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold">0</h4>
        </div>
      </div>
    </div>
  );
}

export default ClientesStats;
