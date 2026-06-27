function StatCard({ titulo, valor, icono, colorBg, colorText }) {
  return (
    <div className="bg-white border border-outline-variant p-lg rounded-xl flex items-center gap-2 px-4 py-4 h-25">
      <div className={`w-12 h-12 ${colorBg} rounded-full flex items-center justify-center ${colorText}`}>
        <span className="material-symbols-outlined">{icono}</span>
      </div>
      <div>
        <p className="text-label-md text-on-surface-variant">{titulo}</p>
        <h4 className="text-4xl font-bold">{valor}</h4>
      </div>
    </div>
  );
}

export default StatCard;