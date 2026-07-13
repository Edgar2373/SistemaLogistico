import { useMemo } from "react";

function OrdersByDayChart({ pedidos }) {
  const datosPorDia = useMemo(() => {
    const ultimos7Dias = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
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
      <div className="h-48 flex flex-col justify-end">
        <div className="flex-1 flex items-end justify-between gap-2 px-2">
          {datosPorDia.map((dato) => (
            <div key={dato.fecha} className="flex-1 flex flex-col items-center h-full">
              <span className="text-xs font-bold text-on-surface mb-1">{dato.cantidad}</span>
              <div className="w-full flex-1 bg-primary-container/5 rounded-t-lg relative">
                <div
                  className="bg-blue-600 w-full rounded-t-lg absolute bottom-0 transition-all duration-500"
                  style={{ height: `${(dato.cantidad / maxCantidad) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-outline capitalize mt-1">{dato.dia}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersByDayChart;
