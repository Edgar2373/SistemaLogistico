function OrdersByStatusChart({ pendientes, enRuta, entregados, cancelados }) {
  const total = pendientes + enRuta + entregados + cancelados;
  const datos = [
    { label: "Pendientes", value: pendientes, color: "#FFA000" },
    { label: "En Ruta", value: enRuta, color: "#1976D2" },
    { label: "Entregados", value: entregados, color: "#43A047" },
    { label: "Cancelados", value: cancelados, color: "#E53935" },
  ];

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
      <h4 className="font-bold text-xl text-on-surface mb-6">Estado de Pedidos</h4>
      <div className="space-y-4">
        {datos.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-24 text-sm font-medium text-on-surface-variant">{item.label}</div>
            <div className="flex-1 h-6 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: total > 0 ? `${(item.value / total) * 100}%` : "0%",
                  backgroundColor: item.color,
                }}
              />
            </div>
            <div className="w-12 text-right text-sm font-bold" style={{ color: item.color }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
      {total === 0 && (
        <p className="text-center text-outline mt-4 text-sm">No hay pedidos registrados</p>
      )}
    </div>
  );
}

export default OrdersByStatusChart;
