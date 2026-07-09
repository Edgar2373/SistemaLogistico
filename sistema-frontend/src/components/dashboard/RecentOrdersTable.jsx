import { useMemo } from "react";
import StatusBadge from "../common/StatusBadge";

function RecentOrdersTable({ pedidos }) {
  const pedidosRecientes = useMemo(() => {
    return [...pedidos]
      .sort((a, b) => b.idPedido - a.idPedido)
      .slice(0, 8);
  }, [pedidos]);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-outline-variant">
        <h4 className="font-bold text-lg sm:text-xl text-on-surface">Últimos Pedidos Registrados</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container text-sm font-medium text-on-surface-variant">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3 hidden md:table-cell">Dirección</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3 hidden sm:table-cell">Costo</th>
              <th className="px-6 py-3 hidden sm:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant text-sm">
            {pedidosRecientes.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-outline">
                  No hay pedidos registrados
                </td>
              </tr>
            ) : (
              pedidosRecientes.map((pedido) => (
                <tr key={pedido.idPedido} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-bold text-on-surface">#{pedido.idPedido}</td>
                  <td className="px-6 py-4">{pedido.cliente?.nombre || "-"}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-on-surface-variant">{pedido.direccionEntrega}</td>
                  <td className="px-6 py-4">
                    <StatusBadge estado={pedido.estadoPedido?.nombreEstado} />
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell font-medium">S/ {pedido.costoEnvio}</td>
                  <td className="px-6 py-4 hidden sm:table-cell text-on-surface-variant">{pedido.fechaRegistro}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrdersTable;
