/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getPedidos, actualizarPedido, eliminarPedido } from "../../services/pedidoService";
import { getEstadosPedido } from "../../services/estadoPedidoService";
import PedidoForm from "../../components/pedido/PedidoForm";
import PedidoDetails from "../../components/pedido/PedidoDetails";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";

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
  const [loading, setLoading] = useState(true);

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Gestión de Pedidos</h2>
          <p className="text-lg text-on-surface-variant mt-1">Registra y administra los pedidos de LogiFlow.</p>
        </div>
        <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-lg font-bold hover:opacity-90 shadow-sm">
          <span className="material-symbols-outlined">add</span> Nuevo Pedido
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
          className="bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">ID</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden md:table-cell">Fecha</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Cliente</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden lg:table-cell">Dirección</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Estado</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden sm:table-cell">Costo</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant text-right">Acciones</th>
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
                filtrados.map(p => (
                  <tr key={p.idPedido} className="hover:bg-surface-container-lowest transition-colors h-12">
                    <td className="px-4 py-3 text-sm font-semibold">#{p.idPedido}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{p.fechaRegistro}</td>
                    <td className="px-4 py-3 text-sm">{p.cliente?.nombre || "-"}</td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">{p.direccionEntrega}</td>
                    <td className="px-4 py-3 text-sm">
                      <StatusBadge estado={p.estadoPedido?.nombreEstado} />
                    </td>
                    <td className="px-4 py-3 text-sm hidden sm:table-cell">S/ {p.costoEnvio}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setSeleccionado(p); setModalDetalle(true); }} className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded transition-colors" title="Ver detalle">
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </button>
                        <button onClick={() => { setSeleccionado(p); setModalEditar(true); }} className="p-2 text-primary hover:bg-primary-fixed rounded transition-colors" title="Editar">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button onClick={() => { setSeleccionado(p); setModalEliminar(true); }} className="p-2 text-error hover:bg-error-container rounded transition-colors" title="Eliminar">
                          <span className="material-symbols-outlined text-xl">delete</span>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold">Nuevo Pedido</h3>
              <button onClick={() => setModalNuevo(false)} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-6 py-4">
              <PedidoForm onExito={() => { setModalNuevo(false); cargar(); }} onCancelar={() => setModalNuevo(false)} />
            </div>
          </div>
        </div>
      )}

      {modalDetalle && seleccionado && (
        <PedidoDetails pedido={seleccionado} onCerrar={() => { setModalDetalle(false); setSeleccionado(null); }} />
      )}

      {modalEditar && seleccionado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold">Editar Pedido #{seleccionado.idPedido}</h3>
              <button onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleActualizar} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Fecha</label><input name="fechaRegistro" type="date" defaultValue={seleccionado.fechaRegistro} className="w-full border border-outline-variant rounded-lg p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Costo Envío (S/)</label><input name="costoEnvio" type="number" step="0.01" defaultValue={seleccionado.costoEnvio} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Hora Salida</label><input name="horaSalida" type="time" defaultValue={seleccionado.horaSalida?.substring(0, 5)} className="w-full border border-outline-variant rounded-lg p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Hora Entrega</label><input name="horaEntrega" type="time" defaultValue={seleccionado.horaEntrega?.substring(0, 5)} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Tiempo Estimado (min)</label><input name="tiempoEstimadoEntrega" type="number" defaultValue={seleccionado.tiempoEstimadoEntrega} className="w-full border border-outline-variant rounded-lg p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Tiempo Real (min)</label><input name="tiempoRealEntrega" type="number" defaultValue={seleccionado.tiempoRealEntrega} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Dirección</label><input name="direccionEntrega" defaultValue={seleccionado.direccionEntrega} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Orden Ruta</label><input name="ordenEnRuta" type="number" defaultValue={seleccionado.ordenEnRuta} className="w-full border border-outline-variant rounded-lg p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                  <select name="idEstado" defaultValue={seleccionado.estadoPedido?.idEstado} className="w-full border border-outline-variant rounded-lg p-2">
                    {estados.map(e => <option key={e.idEstado} value={e.idEstado}>{e.nombreEstado}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="px-4 py-2 rounded-lg font-bold border border-outline-variant">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEliminar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">warning</span>
            </div>
            <h3 className="text-xl font-bold">¿Eliminar pedido?</h3>
            <p className="text-on-surface-variant mt-2">Se eliminará el pedido <strong>#{seleccionado?.idPedido}</strong> permanentemente.</p>
            <div className="flex flex-col gap-2 mt-4">
              <button onClick={handleEliminar} className="w-full py-3 rounded-lg font-bold bg-error text-on-error hover:opacity-90">Confirmar</button>
              <button onClick={() => { setModalEliminar(false); setSeleccionado(null); }} className="w-full py-3 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-low">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Pedidos;
