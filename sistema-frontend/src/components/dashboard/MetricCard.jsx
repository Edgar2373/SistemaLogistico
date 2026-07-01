function MetricCard({ titulo, valor, tendencia, tendenciaIcono, tendenciaColor, subtexto, icono, colorIcono, children }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group px-4 py-3 sm:px-6 sm:py-4">
      <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform`}>
        <span className={`material-symbols-outlined !text-4xl sm:!text-6xl ${colorIcono}`}>{icono}</span>
      </div>
      <div className="relative z-10">
        <p className="font-medium text-on-surface-variant mb-1 uppercase tracking-tight">{titulo}</p>
        <div className="flex items-baseline gap-2">
          <h3 className={`font-bold text-2xl sm:text-3xl ${colorIcono}`}>{valor}</h3>
          {children}
          {tendencia && (
            <span className={`font-medium flex items-center ${tendenciaColor}`}>
              <span className="material-symbols-outlined text-[16px]">{tendenciaIcono}</span> {tendencia}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-outline mt-4">{subtexto}</p>
        
      </div>
    </div>
  );
}

export default MetricCard;