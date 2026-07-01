function StatCard({ titulo, valor, icono, colorBg, colorText }) {
  return (
    <div className="bg-white border border-outline-variant p-6 rounded-xl flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-4 min-h-20">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorBg} rounded-full flex items-center justify-center ${colorText}`}>
        <span className="material-symbols-outlined">{icono}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-on-surface-variant">{titulo}</p>
        <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold">{valor}</h4>
      </div>
    </div>
  );
}

export default StatCard;