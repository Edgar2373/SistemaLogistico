import { useMemo } from "react";

function TopDriversTable({ pedidos, repartidores }) {
  const topRepartidores = useMemo(() => {
    const conteo = {};
    pedidos.forEach(p => {
      if (p.estadoPedido?.nombreEstado === "ENTREGADO" && p.repartidor?.idRepartidor) {
        const id = p.repartidor.idRepartidor;
        conteo[id] = (conteo[id] || 0) + 1;
      }
    });
    return Object.entries(conteo)
      .map(([id, entregas]) => ({
        idRepartidor: Number(id),
        entregas,
        nombre: repartidores.find(r => r.idRepartidor === Number(id))?.licencia || `Rep #${id}`,
      }))
      .sort((a, b) => b.entregas - a.entregas)
      .slice(0, 5);
  }, [pedidos, repartidores]);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
      <h4 className="font-bold text-xl text-on-surface mb-6">Repartidores con Más Entregas</h4>
      {topRepartidores.length === 0 ? (
        <p className="text-center text-outline py-8 text-sm">No hay entregas registradas</p>
      ) : (
        <div className="space-y-3">
          {topRepartidores.map((rep, index) => (
            <div key={rep.idRepartidor} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? "bg-[#FFD700] text-[#8B6914]" :
                index === 1 ? "bg-[#C0C0C0] text-[#666]" :
                index === 2 ? "bg-[#CD7F32] text-white" :
                "bg-surface-container text-on-surface-variant"
              }`}>
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface">{rep.nombre}</p>
                <p className="text-xs text-outline">{rep.entregas} entregas completadas</p>
              </div>
              <span className="material-symbols-outlined text-[#43A047]">check_circle</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopDriversTable;
