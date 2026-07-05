/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getPedidos, crearPedido, actualizarPedido, eliminarPedido } from "../../services/pedidoService";
import { getClientes } from "../../services/clienteService";
import { getRepartidores } from "../../services/repartidorService";
import { getRutas } from "../../services/rutaService";
import { getEstadosPedido } from "../../services/estadoPedidoService";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const [p, c, r, ru, e] = await Promise.all([getPedidos(), getClientes(), getRepartidores(), getRutas(), getEstadosPedido()]);
      setPedidos(p); setClientes(c); setRepartidores(r); setRutas(ru); setEstados(e);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = filtroEstado ? pedidos.filter(p => p.estadoPedido?.nombreEstado === filtroEstado) : pedidos;

  const coloresEstado = {
    PENDIENTE: "bg-[#FFA000]/10 text-[#FFA000]",
    EN_RUTA: "bg-[#1976D2]/10 text-[#1976D2]",
    ENTREGADO: "bg-[#43A047]/10 text-[#43A047]",
    CANCELADO: "bg-[#E53935]/10 text-[#E53935]",
  };

  const handleCrear = async (e) => {
    e.preventDefault(); setError("");
    const fd = new FormData(e.target);
    try {
      await crearPedido({
        fechaRegistro: fd.get("fechaRegistro"), horaSalida: fd.get("horaSalida") + ":00",
        horaEntrega: fd.get("horaEntrega") + ":00", tiempoEstimadoEntrega: Number(fd.get("tiempoEstimadoEntrega")),
        tiempoRealEntrega: Number(fd.get("tiempoRealEntrega") || 0), costoEnvio: Number(fd.get("costoEnvio")),
        direccionEntrega: fd.get("direccionEntrega"), ordenEnRuta: Number(fd.get("ordenEnRuta") || 1),
        cliente: { idCliente: Number(fd.get("idCliente")) }, usuario: { idUsuario: Number(localStorage.getItem("idUsuario")) },
        repartidor: { idRepartidor: Number(fd.get("idRepartidor")) }, ruta: { idRuta: Number(fd.get("idRuta")) },
        estadoPedido: { idEstado: Number(fd.get("idEstado")) }
      });
      setModalNuevo(false); cargar();
    } catch (err) {
      const msg = err.response?.data?.error || Object.values(err.response?.data || {}).join(". ");
      setError(msg || "Error al crear pedido");
    }
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await actualizarPedido(seleccionado.idPedido, {
        fechaRegistro: fd.get("fechaRegistro"), horaSalida: fd.get("horaSalida") + ":00",
        horaEntrega: fd.get("horaEntrega") + ":00", tiempoEstimadoEntrega: Number(fd.get("tiempoEstimadoEntrega")),
        tiempoRealEntrega: Number(fd.get("tiempoRealEntrega")), costoEnvio: Number(fd.get("costoEnvio")),
        direccionEntrega: fd.get("direccionEntrega"), ordenEnRuta: Number(fd.get("ordenEnRuta")),
        cliente: { idCliente: Number(fd.get("idCliente")) }, repartidor: { idRepartidor: Number(fd.get("idRepartidor")) },
        ruta: { idRuta: Number(fd.get("idRuta")) }, estadoPedido: { idEstado: Number(fd.get("idEstado")) }
      });
      setModalEditar(false); setSeleccionado(null); cargar();
    } catch (err) { console.error(err); }
  };

  const handleEliminar = async () => {
    try { await eliminarPedido(seleccionado.idPedido); setModalEliminar(false); setSeleccionado(null); cargar(); } catch (err) { console.error(err); }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Gestión de Pedidos</h2>
          <p className="text-lg text-on-surface-variant mt-1">Administra los pedidos del sistema logístico.</p>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="bg-surface border border-outline-variant rounded-lg px-3 py-3 text-base font-medium focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option value="">Todos los estados</option>
            {estados.map(e => <option key={e.idEstado} value={e.nombreEstado}>{e.nombreEstado}</option>)}
          </select>
          <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-lg font-bold hover:opacity-90 shadow-sm">
            <span className="material-symbols-outlined">add</span> Nuevo Pedido
          </button>
        </div>
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
              {filtrados.map(p => (
                <tr key={p.idPedido} className="hover:bg-surface-container-lowest transition-colors h-12">
                  <td className="px-4 py-3 text-sm font-semibold">#{p.idPedido}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{p.fechaRegistro}</td>
                  <td className="px-4 py-3 text-sm">{p.cliente?.nombre || "-"}</td>
                  <td className="px-4 py-3 text-sm hidden lg:table-cell">{p.direccionEntrega}</td>
                  <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded text-xs font-medium ${coloresEstado[p.estadoPedido?.nombreEstado] || "bg-gray-100 text-gray-600"}`}>{p.estadoPedido?.nombreEstado || "-"}</span></td>
                  <td className="px-4 py-3 text-sm hidden sm:table-cell">S/ {p.costoEnvio}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setSeleccionado(p); setModalEditar(true); }} className="p-2 text-primary hover:bg-primary-fixed rounded transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                      <button onClick={() => { setSeleccionado(p); setModalEliminar(true); }} className="p-2 text-error hover:bg-error-container rounded transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalNuevo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold">Nuevo Pedido</h3>
              <button onClick={() => setModalNuevo(false)} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleCrear} className="px-6 py-4 space-y-4">
              {error && <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Fecha Registro</label><input name="fechaRegistro" type="date" className="w-full border border-outline-variant rounded-lg p-2" required /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Costo Envío (S/)</label><input name="costoEnvio" type="number" step="0.01" className="w-full border border-outline-variant rounded-lg p-2" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Hora Salida</label><input name="horaSalida" type="time" className="w-full border border-outline-variant rounded-lg p-2" required /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Hora Entrega</label><input name="horaEntrega" type="time" className="w-full border border-outline-variant rounded-lg p-2" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Tiempo Estimado (min)</label><input name="tiempoEstimadoEntrega" type="number" className="w-full border border-outline-variant rounded-lg p-2" required /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Tiempo Real (min)</label><input name="tiempoRealEntrega" type="number" defaultValue="0" className="w-full border border-outline-variant rounded-lg p-2" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Dirección Entrega</label><input name="direccionEntrega" className="w-full border border-outline-variant rounded-lg p-2" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Orden en Ruta</label><input name="ordenEnRuta" type="number" defaultValue="1" className="w-full border border-outline-variant rounded-lg p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                  <select name="idEstado" className="w-full border border-outline-variant rounded-lg p-2" required>
                    <option value="">Seleccione...</option>
                    {estados.map(e => <option key={e.idEstado} value={e.idEstado}>{e.nombreEstado}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Cliente</label>
                  <select name="idCliente" className="w-full border border-outline-variant rounded-lg p-2" required>
                    <option value="">Seleccione...</option>
                    {clientes.map(c => <option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Repartidor</label>
                  <select name="idRepartidor" className="w-full border border-outline-variant rounded-lg p-2" required>
                    <option value="">Seleccione...</option>
                    {repartidores.map(r => <option key={r.idRepartidor} value={r.idRepartidor}>Rep #{r.idRepartidor}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Ruta</label>
                  <select name="idRuta" className="w-full border border-outline-variant rounded-lg p-2" required>
                    <option value="">Seleccione...</option>
                    {rutas.map(r => <option key={r.idRuta} value={r.idRuta}>{r.nombreRuta}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalNuevo(false)} className="px-4 py-2 rounded-lg font-bold border border-outline-variant">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90">Crear Pedido</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEditar && seleccionado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold">Editar Pedido #{seleccionado.idPedido}</h3>
              <button onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleActualizar} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Fecha Registro</label><input name="fechaRegistro" type="date" defaultValue={seleccionado.fechaRegistro} className="w-full border border-outline-variant rounded-lg p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Costo Envío (S/)</label><input name="costoEnvio" type="number" step="0.01" defaultValue={seleccionado.costoEnvio} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Hora Salida</label><input name="horaSalida" type="time" defaultValue={seleccionado.horaSalida?.substring(0, 5)} className="w-full border border-outline-variant rounded-lg p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Hora Entrega</label><input name="horaEntrega" type="time" defaultValue={seleccionado.horaEntrega?.substring(0, 5)} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Tiempo Estimado</label><input name="tiempoEstimadoEntrega" type="number" defaultValue={seleccionado.tiempoEstimadoEntrega} className="w-full border border-outline-variant rounded-lg p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Tiempo Real</label><input name="tiempoRealEntrega" type="number" defaultValue={seleccionado.tiempoRealEntrega} className="w-full border border-outline-variant rounded-lg p-2" /></div>
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
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Cliente</label>
                  <select name="idCliente" defaultValue={seleccionado.cliente?.idCliente} className="w-full border border-outline-variant rounded-lg p-2">
                    {clientes.map(c => <option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Repartidor</label>
                  <select name="idRepartidor" defaultValue={seleccionado.repartidor?.idRepartidor} className="w-full border border-outline-variant rounded-lg p-2">
                    {repartidores.map(r => <option key={r.idRepartidor} value={r.idRepartidor}>Rep #{r.idRepartidor}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Ruta</label>
                  <select name="idRuta" defaultValue={seleccionado.ruta?.idRuta} className="w-full border border-outline-variant rounded-lg p-2">
                    {rutas.map(r => <option key={r.idRuta} value={r.idRuta}>{r.nombreRuta}</option>)}
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
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-4xl">warning</span></div>
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
