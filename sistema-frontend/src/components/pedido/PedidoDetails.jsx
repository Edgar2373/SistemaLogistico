import StatusBadge from "../common/StatusBadge";
import { EMPRESA_CONFIG } from "../../utils/constans";

function PedidoDetails({ pedido, detalles = [], onCerrar }) {
  if (!pedido) return null;

  const totalProductos = detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0);
  const totalGeneral = totalProductos + (pedido.costoEnvio || 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-xl font-bold">Detalle del Pedido #{pedido.idPedido}</h3>
          <button onClick={onCerrar} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-6 py-6">
          <div className="border-2 border-dashed border-outline-variant rounded-lg p-5">
            {/* Logo + Empresa */}
            <div className="text-center mb-4">
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                <img
                  src="/img/logowTwo.jpg"
                  alt="Logo Empresa"
                  className="w-35 h-35 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary">business</span>
                </div>
              </div>
              <h2 className="text-lg font-bold text-on-surface">{EMPRESA_CONFIG.nombre}</h2>
              <p className="text-xs text-on-surface-variant">{EMPRESA_CONFIG.direccion}</p>
              <p className="text-xs text-on-surface-variant">{EMPRESA_CONFIG.telefono}</p>
            </div>

            {/* N Pedido */}
            <div className="text-center border-t border-b border-outline-variant py-2 mb-4">
              <p className="text-xs text-on-surface-variant">PEDIDO</p>
              <p className="text-xl font-bold text-primary">#{pedido.idPedido}</p>
              <div className="flex justify-center mt-1">
                <StatusBadge estado={pedido.estadoPedido?.nombreEstado} />
              </div>
            </div>

            {/* Datos Cliente */}
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-500">Cliente</p>
              <p className="text-sm">{pedido.cliente?.nombre || "-"}</p>
            </div>

            {/* Direccion */}
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-500">Direccin de Entrega</p>
              <p className="text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {pedido.direccionEntrega}
              </p>
            </div>

            {/* Horarios */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-bold text-slate-500">Hora Salida</p>
                <p className="text-sm">{pedido.horaSalida}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Hora Entrega</p>
                <p className="text-sm">{pedido.horaEntrega}</p>
              </div>
            </div>

            {/* Detalle Productos */}
            {detalles.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-500 mb-2">Detalle Productos</p>
                <div className="border border-outline-variant rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-container-low">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-bold text-slate-500">Producto</th>
                        <th className="px-3 py-2 text-center text-xs font-bold text-slate-500">Cant.</th>
                        <th className="px-3 py-2 text-right text-xs font-bold text-slate-500">P. Unit.</th>
                        <th className="px-3 py-2 text-right text-xs font-bold text-slate-500">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40">
                      {detalles.map((d, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2">{d.producto?.nombreProducto || `Producto #${d.producto?.idProducto}`}</td>
                          <td className="px-3 py-2 text-center">{d.cantidad}</td>
                          <td className="px-3 py-2 text-right">S/ {d.precioUnitario?.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-bold">S/ {(d.cantidad * d.precioUnitario).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                </div>
              </div>
            )}

            {/* Costo Envio */}
            <div className="flex justify-between text-sm border-t border-outline-variant pt-2 mb-2">
              <span>Costo envo</span>
              <span>S/ {pedido.costoEnvio?.toFixed(2) || "0.00"}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between text-lg font-bold border-t-2 border-on-surface pt-2">
              <span>TOTAL</span>
              <span className="text-primary">S/ {totalGeneral.toFixed(2)}</span>
            </div>

            {/* Formas de pago */}
            <div className="mt-4 p-3 bg-surface-container-low rounded-lg">
              <p className="text-xs font-bold text-slate-500 mb-1">Formas de Pago</p>
              <p className="text-xs text-on-surface-variant">Transferencia: {EMPRESA_CONFIG.ctaBancaria}</p>
              <p className="text-xs text-on-surface-variant">Yape: {EMPRESA_CONFIG.yape}</p>
              <p className="text-xs text-on-surface-variant">Plin: {EMPRESA_CONFIG.plin}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-outline-variant flex justify-end">
          <button onClick={onCerrar} className="px-5 py-2.5 rounded-lg font-bold border border-outline-variant hover:bg-surface-container-low">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PedidoDetails;
