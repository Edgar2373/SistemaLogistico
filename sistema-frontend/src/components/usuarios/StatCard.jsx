function StatCard({ label, value, icon, iconBgClass, iconTextClass }) {
  return (
    <div className="bg-white border border-outline-variant p-4 rounded-xl flex items-center gap-4">
      <div className={`w-12 h-12 ${iconBgClass} ${iconTextClass} rounded-full flex items-center justify-center`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-label-md text-on-surface-variant">{label}</p>
        <h4 className="text-2xl font-bold text-on-surface">{value}</h4>
      </div>
    </div>
  );
}

export default StatCard;
