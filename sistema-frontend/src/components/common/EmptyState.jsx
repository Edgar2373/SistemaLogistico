function EmptyState({ icon = "inbox", titulo = "No hay datos", descripcion = "No se encontraron registros." }) {
  return (
    <div className="p-8 text-center text-on-surface-variant">
      <span className="material-symbols-outlined text-5xl text-outline">{icon}</span>
      <p className="mt-2 font-medium">{titulo}</p>
      <p className="text-sm text-outline mt-1">{descripcion}</p>
    </div>
  );
}

export default EmptyState;
