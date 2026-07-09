import StatusBadge from "../common/StatusBadge";

function PedidoDetails({ pedido, onCerrar }) {
  if (!pedido) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-xl font-bold">Detalle del Pedido #{pedido.idPedido}</h3>
          <button onClick={onCerrar} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500">Estado</p>
              <StatusBadge estado={pedido.estadoPedido?.nombreEstado} className="mt-1" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Fecha</p>
              <p className="text-sm">{pedido.fechaRegistro}</p>
            </div>
          </div>

          <div className="border-t border-outline-variant pt-4">
            <h4 className="font-bold text-on-surface mb-2">Cliente</h4>
            <p className="text-sm">{pedido.cliente?.nombre || "-"}</p>
          </div>

          <div className="border-t border-outline-variant pt-4">
            <h4 className="font-bold text-on-surface mb-2">Dirección de Entrega</h4>
            <p className="text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {pedido.direccionEntrega}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4">
            <div>
              <p className="text-xs font-bold text-slate-500">Hora Salida</p>
              <p className="text-sm">{pedido.horaSalida}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Hora Entrega</p>
              <p className="text-sm">{pedido.horaEntrega}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500">Tiempo Estimado</p>
              <p className="text-sm">{pedido.tiempoEstimadoEntrega} min</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Costo Envío</p>
              <p className="text-sm font-bold text-primary">S/ {pedido.costoEnvio}</p>
            </div>
          </div>

          <div className="border-t border-outline-variant pt-4">
            <h4 className="font-bold text-on-surface mb-2">Repartidor Asignado</h4>
            <p className="text-sm">{pedido.repartidor?.licencia || `Rep #${pedido.repartidor?.idRepartidor}`}</p>
          </div>

          <div className="border-t border-outline-variant pt-4">
            <h4 className="font-bold text-on-surface mb-2">Ruta</h4>
            <p className="text-sm">{pedido.ruta?.nombreRuta || "-"}</p>
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
