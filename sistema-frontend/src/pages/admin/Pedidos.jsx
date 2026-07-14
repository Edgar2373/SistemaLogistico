/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getPedidos, actualizarPedido, eliminarPedido } from "../../services/pedidoService";
import { getEstadosPedido } from "../../services/estadoPedidoService";
import { getDetallesPedido } from "../../services/detallePedidoService";
import { EMPRESA_CONFIG } from "../../utils/constans";
import PedidoForm from "../../components/pedido/PedidoForm";
import PedidoDetails from "../../components/pedido/PedidoDetails";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from "../../api/axiosConfig";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [loading, setLoading] = useState(true);

  const enviarWhatsApp = async (pedido) => {
    try {
      const todosDetalles = await getDetallesPedido();
      const detalles = todosDetalles.filter(d => d.pedido?.idPedido === pedido.idPedido);
      const cliente = pedido.cliente?.nombre || "Cliente";
      let msg = `Hola ${cliente}, su pedido #${pedido.idPedido} est registrado.\n\nProductos:\n`;
      detalles.forEach(d => {
        msg += `- ${d.producto?.nombreProducto || "Producto"} x${d.cantidad} = S/ ${(d.cantidad * d.precioUnitario).toFixed(2)}\n`;
      });
      msg += `\nCosto envo: S/ ${pedido.costoEnvio?.toFixed(2) || "0.00"}`;
      const totalProductos = detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0);
      const totalMonto = totalProductos + (pedido.costoEnvio || 0);
      msg += `\nTotal: S/ ${totalMonto.toFixed(2)}`;

      try {
        const res = await api.post("/pagos/generar-link", {
          idPedido: pedido.idPedido,
          monto: totalMonto,
          cliente: cliente
        });
        
        msg += `\n\nPuede realizar el pago seguro con tarjeta ingresando a este enlace: ${res.data.init_point}`;
      } catch (e) {
        console.error("El backend de Spring Boot rechazó la petición HTTP:", e.response?.status, e.response?.data || e.message);
        msg += `\n\nFormas de pago:\n- Transferencia: ${EMPRESA_CONFIG.ctaBancaria}\n- Yape: ${EMPRESA_CONFIG.yape}\n- Plin: ${EMPRESA_CONFIG.plin}`;
      }

      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error al generar link:", err);
    }
  };

  const cargar = async () => {
    try {
      const [p, e] = await Promise.all([getPedidos(), getEstadosPedido()]);
      setPedidos(p);
      setEstados(e);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = pedidos.filter(p => {
    const coincideEstado = filtroEstado ? p.estadoPedido?.nombreEstado === filtroEstado : true;
    const coincideBusqueda = busqueda
      ? String(p.idPedido).includes(busqueda) ||
        p.cliente?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.direccionEntrega?.toLowerCase().includes(busqueda.toLowerCase())
      : true;
    return coincideEstado && coincideBusqueda;
  });

  const handleActualizar = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await actualizarPedido(seleccionado.idPedido, {
        fechaRegistro: fd.get("fechaRegistro"),
        horaSalida: fd.get("horaSalida") + ":00",
        horaEntrega: fd.get("horaEntrega") + ":00",
        tiempoEstimadoEntrega: Number(fd.get("tiempoEstimadoEntrega")),
        tiempoRealEntrega: Number(fd.get("tiempoRealEntrega")),
        costoEnvio: Number(fd.get("costoEnvio")),
        direccionEntrega: fd.get("direccionEntrega"),
        ordenEnRuta: Number(fd.get("ordenEnRuta")),
        cliente: { idCliente: Number(fd.get("idCliente")) },
        repartidor: { idRepartidor: Number(fd.get("idRepartidor")) },
        ruta: { idRuta: Number(fd.get("idRuta")) },
        estadoPedido: { idEstado: Number(fd.get("idEstado")) },
      });
      setModalEditar(false);
      setSeleccionado(null);
      cargar();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminar = async () => {
    try {
      await eliminarPedido(seleccionado.idPedido);
      setModalEliminar(false);
      setSeleccionado(null);
      cargar();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-on-surface">Gestión de Pedidos</h2>
          <p className="text-sm sm:text-base md:text-lg text-on-surface-variant mt-1">Registra y administra los pedidos de LogiFlow.</p>
        </div>
        <button onClick={() => setModalNuevo(true)} className="flex items-center gap-1.5 sm:gap-2 bg-primary text-on-primary px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:opacity-90 shadow-sm shrink-0">
          <span className="material-symbols-outlined text-xl sm:text-2xl">add</span> Nuevo Pedido
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Buscar por ID, cliente o dirección..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
        >
          <option value="">Todos los estados</option>
          {estados.map(e => (
            <option key={e.idEstado} value={e.nombreEstado}>{e.nombreEstado}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant">ID</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant hidden md:table-cell">Fecha</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant">Cliente</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant hidden lg:table-cell">Dirección</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant">Estado</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant hidden sm:table-cell">Costo</th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-outline">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                filtrados.reverse().map(p => (
                  <tr key={p.idPedido} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold">#{p.idPedido}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm hidden md:table-cell">{p.fechaRegistro}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm max-w-[120px] sm:max-w-none truncate">{p.cliente?.nombre || "-"}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm hidden lg:table-cell max-w-[200px] truncate">{p.direccionEntrega}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm">
                      <StatusBadge estado={p.estadoPedido?.nombreEstado} />
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">S/ {p.costoEnvio}</td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-right">
                      <div className="flex justify-end gap-0.5 sm:gap-1">
                        <button onClick={async () => {
                          setSeleccionado(p);
                          setModalDetalle(true);
                          try {
                            const todosDetalles = await getDetallesPedido();
                            setDetallesPedido(todosDetalles.filter(d => d.pedido?.idPedido === p.idPedido));
                          } catch (e) { console.error(e); setDetallesPedido([]); }
                        }} className="p-1.5 sm:p-2 text-on-surface-variant hover:bg-surface-container-low rounded transition-colors" title="Ver detalle">
                          <span className="material-symbols-outlined text-lg sm:text-xl">visibility</span>
                        </button>
                        <button onClick={() => enviarWhatsApp(p)} className="p-1.5 sm:p-2 text-[#25D366] hover:bg-[#25D366]/10 rounded transition-colors" title="Enviar por WhatsApp">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </button>
                        <button onClick={() => { setSeleccionado(p); setModalEditar(true); }} className="p-1.5 sm:p-2 text-primary hover:bg-primary-fixed rounded transition-colors" title="Editar">
                          <span className="material-symbols-outlined text-lg sm:text-xl">edit</span>
                        </button>
                        <button onClick={() => { setSeleccionado(p); setModalEliminar(true); }} className="p-1.5 sm:p-2 text-error hover:bg-error-container rounded transition-colors" title="Eliminar">
                          <span className="material-symbols-outlined text-lg sm:text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalNuevo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 modal-overlay">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-base sm:text-xl font-bold">Nuevo Pedido</h3>
              <button onClick={() => setModalNuevo(false)} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 sm:px-6 sm:py-4">
              <PedidoForm onExito={() => { setModalNuevo(false); cargar(); }} onCancelar={() => setModalNuevo(false)} />
            </div>
          </div>
        </div>
      )}

      {modalDetalle && seleccionado && (
        <PedidoDetails pedido={seleccionado} detalles={detallesPedido} onCerrar={() => { setModalDetalle(false); setSeleccionado(null); setDetallesPedido([]); }} />
      )}

      {modalEditar && seleccionado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 modal-overlay">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-base sm:text-xl font-bold">Editar Pedido #{seleccionado.idPedido}</h3>
              <button onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleActualizar} className="p-4 sm:px-6 sm:py-4 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Fecha</label><input name="fechaRegistro" type="date" defaultValue={seleccionado.fechaRegistro} className="w-full border border-outline-variant rounded-lg p-2 text-sm" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Costo Envío (S/)</label><input name="costoEnvio" type="number" step="0.01" defaultValue={seleccionado.costoEnvio} className="w-full border border-outline-variant rounded-lg p-2 text-sm" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Hora Salida</label><input name="horaSalida" type="time" defaultValue={seleccionado.horaSalida?.substring(0, 5)} className="w-full border border-outline-variant rounded-lg p-2 text-sm" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Hora Entrega</label><input name="horaEntrega" type="time" defaultValue={seleccionado.horaEntrega?.substring(0, 5)} className="w-full border border-outline-variant rounded-lg p-2 text-sm" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Tiempo Estimado (min)</label><input name="tiempoEstimadoEntrega" type="number" defaultValue={seleccionado.tiempoEstimadoEntrega} className="w-full border border-outline-variant rounded-lg p-2 text-sm" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Tiempo Real (min)</label><input name="tiempoRealEntrega" type="number" defaultValue={seleccionado.tiempoRealEntrega} className="w-full border border-outline-variant rounded-lg p-2 text-sm" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Dirección</label><input name="direccionEntrega" defaultValue={seleccionado.direccionEntrega} className="w-full border border-outline-variant rounded-lg p-2 text-sm" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Orden Ruta</label><input name="ordenEnRuta" type="number" defaultValue={seleccionado.ordenEnRuta} className="w-full border border-outline-variant rounded-lg p-2 text-sm" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                  <select name="idEstado" defaultValue={seleccionado.estadoPedido?.idEstado} className="w-full border border-outline-variant rounded-lg p-2 text-sm">
                    {estados.map(e => <option key={e.idEstado} value={e.idEstado}>{e.nombreEstado}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg font-bold border border-outline-variant text-sm">Cancelar</button>
                <button type="submit" className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90 text-sm">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEliminar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 modal-overlay">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-5 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="material-symbols-outlined text-3xl sm:text-4xl">warning</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">¿Eliminar pedido?</h3>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">Se eliminará el pedido <strong>#{seleccionado?.idPedido}</strong> permanentemente.</p>
            <div className="flex flex-col gap-2 mt-4">
              <button onClick={handleEliminar} className="w-full py-2.5 sm:py-3 rounded-lg font-bold bg-error text-on-error hover:opacity-90 text-sm sm:text-base">Confirmar</button>
              <button onClick={() => { setModalEliminar(false); setSeleccionado(null); }} className="w-full py-2.5 sm:py-3 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-low text-sm sm:text-base">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Pedidos;
