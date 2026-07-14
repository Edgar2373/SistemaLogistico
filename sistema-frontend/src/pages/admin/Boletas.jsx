/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getBoletas } from "../../services/boletaService";
import { getPedidoPorId, actualizarPedido } from "../../services/pedidoService";
import { getEstadosPedido } from "../../services/estadoPedidoService";
import { getPagos, actualizarPago } from "../../services/pagoService";
import { getDetallesPedido } from "../../services/detallePedidoService";
import { EMPRESA_CONFIG } from "../../utils/constans";
import BoletaPreview from "../../components/boleta/BoletaPreview";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function Boletas() {
  const [boletas, setBoletas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [pagoDetalle, setPagoDetalle] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const b = await getBoletas();
      setBoletas(b);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const filtradas = boletas.filter(b => {
    if (!busqueda) return true;
    return (
      String(b.idBoleta).includes(busqueda) ||
      String(b.pedido?.idPedido).includes(busqueda) ||
      String(b.total).includes(busqueda)
    );
  });

  const verDetalle = async (boleta) => {
    setSeleccionado(boleta);
    setPedidoDetalle(boleta.pedido || null);
    try {
      const [todosDetalles, pagos] = await Promise.all([getDetallesPedido(), getPagos()]);
      const filtrados = todosDetalles.filter(d => d.pedido?.idPedido === boleta.pedido?.idPedido);
      setDetallesPedido(filtrados);
      const pago = pagos.find(p => p.boleta?.idBoleta === boleta.idBoleta);
      setPagoDetalle(pago || null);
    } catch (e) {
      console.error(e);
      setDetallesPedido([]);
      setPagoDetalle(null);
    }
    setModalDetalle(true);
  };

  const enviarWhatsApp = (boleta) => {
    const cliente = boleta.pedido?.cliente?.nombre || "Cliente";
    const total = boleta.total?.toFixed(2) || "0.00";
    const numBoleta = `BOL-000${boleta.idBoleta}`;
    const msg = `Hola ${cliente}, su boleta ${numBoleta} por S/${total} está lista.\n\nFormas de pago:\n- Transferencia: ${EMPRESA_CONFIG.ctaBancaria}\n- Yape: ${EMPRESA_CONFIG.yape}\n- Plin: ${EMPRESA_CONFIG.plin}`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const cancelarBoleta = async () => {
    if (!seleccionado) return;
    try {
      const pedido = await getPedidoPorId(seleccionado.pedido?.idPedido);
      const estados = await getEstadosPedido();
      const estadoCancelado = estados.find(e => e.nombreEstado === "CANCELADO");
      if (!estadoCancelado) {
        console.error("No se encontr estado CANCELADO");
        return;
      }
      await actualizarPedido(pedido.idPedido, {
        fechaRegistro: pedido.fechaRegistro,
        horaSalida: pedido.horaSalida,
        horaEntrega: pedido.horaEntrega,
        tiempoEstimadoEntrega: pedido.tiempoEstimadoEntrega,
        tiempoRealEntrega: pedido.tiempoRealEntrega,
        costoEnvio: pedido.costoEnvio,
        direccionEntrega: pedido.direccionEntrega,
        ordenEnRuta: pedido.ordenEnRuta,
        cliente: { idCliente: pedido.cliente?.idCliente },
        usuario: { idUsuario: pedido.usuario?.idUsuario },
        repartidor: { idRepartidor: pedido.repartidor?.idRepartidor },
        ruta: { idRuta: pedido.ruta?.idRuta },
        estadoPedido: { idEstado: estadoCancelado.idEstado },
      });

      const pagos = await getPagos();
      const pagoAsociado = pagos.find(p => p.boleta?.idBoleta === seleccionado.idBoleta);
      if (pagoAsociado) {
        await actualizarPago(pagoAsociado.idPago, {
          metodoPago: pagoAsociado.metodoPago,
          estadoPago: "CANCELADO",
          fechaPago: pagoAsociado.fechaPago,
          referenciaTransaccion: pagoAsociado.referenciaTransaccion,
          boleta: { idBoleta: seleccionado.idBoleta },
        });
      }
      setModalCancelar(false);
      setSeleccionado(null);
      await cargar();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-on-surface">Gestión de Boletas</h2>
          <p className="text-sm sm:text-base md:text-lg text-on-surface-variant mt-1">Boletas generadas automáticamente al registrar pedidos.</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative w-full sm:max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Buscar por ID, pedido o total..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant">N° Boleta</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant">Pedido</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant hidden sm:table-cell">Fecha Emisión</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant hidden sm:table-cell">Total</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant">Estado</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filtradas.length === 0 ? (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-outline">No se encontraron boletas</td></tr>
              ) : (
                filtradas.reverse().map(b => (
                  <tr key={b.idBoleta} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold">BOL-000{b.idBoleta}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm">#{b.pedido?.idPedido || "-"}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">{b.fechaEmision}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-primary hidden sm:table-cell">S/ {b.total?.toFixed(2)}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm">
                      <StatusBadge estado={b.pedido?.estadoPedido?.nombreEstado} />
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-right">
                      <div className="flex justify-end gap-0.5 sm:gap-1">
                        <button onClick={() => verDetalle(b)} className="p-1.5 sm:p-2 text-on-surface-variant hover:bg-surface-container-low rounded transition-colors" title="Ver detalle">
                          <span className="material-symbols-outlined text-lg sm:text-xl">visibility</span>
                        </button>
                        <button onClick={() => enviarWhatsApp(b)} className="p-1.5 sm:p-2 text-[#25D366] hover:bg-[#25D366]/10 rounded transition-colors" title="Enviar por WhatsApp">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </button>
                        {b.pedido?.estadoPedido?.nombreEstado !== "CANCELADO" && (
                          <button onClick={() => { setSeleccionado(b); setModalCancelar(true); }} className="p-1.5 sm:p-2 text-error hover:bg-error-container rounded transition-colors" title="Cancelar boleta">
                            <span className="material-symbols-outlined text-lg sm:text-xl">cancel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalDetalle && seleccionado && (
        <BoletaPreview
          boleta={seleccionado}
          pedido={pedidoDetalle}
          detalles={detallesPedido}
          pago={pagoDetalle}
          onCerrar={() => { setModalDetalle(false); setSeleccionado(null); setPedidoDetalle(null); setDetallesPedido([]); setPagoDetalle(null); }}
        />
      )}

      {modalCancelar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 modal-overlay">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-5 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="material-symbols-outlined text-3xl sm:text-4xl">warning</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">Cancelar boleta?</h3>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Se cancelará la boleta <strong>BOL-000{seleccionado?.idBoleta}</strong> y el pedido <strong>#{seleccionado?.pedido?.idPedido}</strong> cambiará a estado <strong>CANCELADO</strong>.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <button onClick={cancelarBoleta} className="w-full py-2.5 sm:py-3 rounded-lg font-bold bg-error text-on-error hover:opacity-90 text-sm sm:text-base">Confirmar</button>
              <button onClick={() => { setModalCancelar(false); setSeleccionado(null); }} className="w-full py-2.5 sm:py-3 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-low text-sm sm:text-base">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Boletas;
