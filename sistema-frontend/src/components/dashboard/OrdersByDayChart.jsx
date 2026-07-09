import { useMemo } from "react";

function OrdersByDayChart({ pedidos }) {
  const datosPorDia = useMemo(() => {
    const ultimos7Dias = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().split("T")[0];
      const dia = fecha.toLocaleDateString("es-PE", { weekday: "short" });
      const cantidad = pedidos.filter(p => p.fechaRegistro === fechaStr).length;
      ultimos7Dias.push({ dia, cantidad, fecha: fechaStr });
    }
    return ultimos7Dias;
  }, [pedidos]);

  const maxCantidad = Math.max(...datosPorDia.map(d => d.cantidad), 1);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
      <h4 className="font-bold text-xl text-on-surface mb-6">Pedidos por Día</h4>
      <div className="h-48 flex items-end justify-between gap-2 px-2">
        {datosPorDia.map((dato) => (
          <div key={dato.fecha} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-primary-container/20 rounded-t-lg relative group" style={{ height: "100%" }}>
              <div
                className="bg-primary w-full rounded-t-lg absolute bottom-0 transition-all duration-500"
                style={{ height: `${(dato.cantidad / maxCantidad) * 100}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-on-background text-white text-[10px] py-1 px-2 rounded whitespace-nowrap transition-opacity">
                  {dato.cantidad} pedidos
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-outline capitalize">{dato.dia}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersByDayChart;
