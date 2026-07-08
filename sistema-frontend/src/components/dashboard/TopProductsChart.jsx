import { useMemo } from "react";

function TopProductsChart({ pedidos }) {
  const productosVendidos = useMemo(() => {
    const conteo = {};
    pedidos.forEach(p => {
      if (p.detalles) {
        p.detalles.forEach(d => {
          const nombre = d.producto?.nombreProducto || "Producto";
          conteo[nombre] = (conteo[nombre] || 0) + d.cantidad;
        });
      }
    });
    return Object.entries(conteo)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }, [pedidos]);

  const maxCantidad = Math.max(...productosVendidos.map(p => p.cantidad), 1);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
      <h4 className="font-bold text-xl text-on-surface mb-6">Productos Más Vendidos</h4>
      {productosVendidos.length === 0 ? (
        <p className="text-center text-outline py-8 text-sm">No hay datos de ventas disponibles</p>
      ) : (
        <div className="space-y-3">
          {productosVendidos.map((producto, index) => (
            <div key={producto.nombre} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-on-surface truncate">{producto.nombre}</span>
                  <span className="text-sm font-bold text-primary ml-2">{producto.cantidad}</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(producto.cantidad / maxCantidad) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopProductsChart;
