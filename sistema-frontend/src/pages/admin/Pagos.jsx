/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getPagos, crearPago, actualizarPago, eliminarPago } from "../../services/pagoService";
import { getBoletas } from "../../services/boletaService";
import { METODOS_PAGO } from "../../utils/constans";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [boletas, setBoletas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const [p, b] = await Promise.all([getPagos(), getBoletas()]);
      setPagos(p);
      setBoletas(b);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = pagos.filter(p => {
    const coincideEstado = filtroEstado ? p.estadoPago === filtroEstado : true;
    const coincideBusqueda = busqueda
      ? String(p.idPago).includes(busqueda) ||
        p.metodoPago?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.referenciaTransaccion?.toLowerCase().includes(busqueda.toLowerCase())
      : true;
    return coincideEstado && coincideBusqueda;
  });

  const handleCrear = async (e) => {
    e.preventDefault(); setError("");
    const fd = new FormData(e.target);
    const metodo = fd.get("metodoPago");
    const estado = fd.get("estadoPago");
    const fecha = fd.get("fechaPago");
    const ref = fd.get("referenciaTransaccion");
    const idBoleta = fd.get("idBoleta");
    if (!metodo || !estado || !fecha || !ref || !idBoleta) {
      setError("Todos los campos son obligatorios"); return;
    }
    try {
      await crearPago({
        metodoPago: metodo,
        estadoPago: estado,
        fechaPago: fecha,
        referenciaTransaccion: ref,
        boleta: { idBoleta: Number(idBoleta) },
      });
      setModalNuevo(false); cargar();
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear pago");
    }
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await actualizarPago(seleccionado.idPago, {
        metodoPago: fd.get("metodoPago"),
        estadoPago: fd.get("estadoPago"),
        fechaPago: fd.get("fechaPago"),
        referenciaTransaccion: fd.get("referenciaTransaccion"),
      });
      setModalEditar(false); setSeleccionado(null); cargar();
    } catch (err) { console.error(err); }
  };

  const handleEliminar = async () => {
    try {
      await eliminarPago(seleccionado.idPago);
      setModalEliminar(false); setSeleccionado(null); cargar();
    } catch (err) { console.error(err); }
  };

  const coloresEstado = {
    PAGADO: "bg-[#43A047]/10 text-[#43A047]",
    PENDIENTE: "bg-[#FFA000]/10 text-[#FFA000]",
    CANCELADO: "bg-[#E53935]/10 text-[#E53935]",
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Gestión de Pagos</h2>
          <p className="text-lg text-on-surface-variant mt-1">Registra y administra los métodos de pago.</p>
        </div>
        <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-lg font-bold hover:opacity-90 shadow-sm">
          <span className="material-symbols-outlined">add</span> Nuevo Pago
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Buscar por ID, método o referencia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm font-medium"
        >
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="PAGADO">Pagado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">ID</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Boleta</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Método</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Estado</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden md:table-cell">Fecha</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden lg:table-cell">Referencia</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filtrados.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-outline">No se encontraron pagos</td></tr>
              ) : (
                pagos.map(p => (
                  <tr key={p.idPago} className="hover:bg-surface-container-lowest transition-colors h-12">
                    <td className="px-4 py-3 text-sm font-semibold">#{p.idPago}</td>
                    <td className="px-4 py-3 text-sm">BOL-000{p.boleta?.idBoleta || "-"}</td>
                    <td className="px-4 py-3 text-sm">{p.metodoPago}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${coloresEstado[p.estadoPago] || "bg-gray-100 text-gray-600"}`}>
                        {p.estadoPago}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{p.fechaPago}</td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell font-mono text-xs">{p.referenciaTransaccion}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
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
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold">Registrar Pago</h3>
              <button onClick={() => setModalNuevo(false)} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleCrear} className="px-6 py-4 space-y-4">
              {error && <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">{error}</div>}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Boleta *</label>
                <select name="idBoleta" className="w-full border border-outline-variant rounded-lg p-2" required>
                  <option value="">Seleccione una boleta...</option>
                  {boletas.map(b => (
                    <option key={b.idBoleta} value={b.idBoleta}>
                      BOL-000{b.idBoleta} - Pedido #{b.pedido?.idPedido} - S/ {b.total}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Método de Pago *</label>
                  <select name="metodoPago" className="w-full border border-outline-variant rounded-lg p-2" required>
                    <option value="">Seleccione...</option>
                    {METODOS_PAGO.map(m => (
                      <option key={m} value={m.toUpperCase()}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Estado *</label>
                  <select name="estadoPago" className="w-full border border-outline-variant rounded-lg p-2" required>
                    <option value="">Seleccione...</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADO">Pagado</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Fecha de Pago *</label>
                  <input name="fechaPago" type="date" className="w-full border border-outline-variant rounded-lg p-2" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Referencia *</label>
                  <input name="referenciaTransaccion" className="w-full border border-outline-variant rounded-lg p-2" placeholder="REF-001" required />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalNuevo(false)} className="px-4 py-2 rounded-lg font-bold border border-outline-variant">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEditar && seleccionado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold">Editar Pago #{seleccionado.idPago}</h3>
              <button onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleActualizar} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Método</label>
                  <select name="metodoPago" defaultValue={seleccionado.metodoPago} className="w-full border border-outline-variant rounded-lg p-2">
                    {METODOS_PAGO.map(m => (
                      <option key={m} value={m.toUpperCase()}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                  <select name="estadoPago" defaultValue={seleccionado.estadoPago} className="w-full border border-outline-variant rounded-lg p-2">
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADO">Pagado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Fecha</label>
                <input name="fechaPago" type="date" defaultValue={seleccionado.fechaPago} className="w-full border border-outline-variant rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Referencia</label>
                <input name="referenciaTransaccion" defaultValue={seleccionado.referenciaTransaccion} className="w-full border border-outline-variant rounded-lg p-2" />
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
            <h3 className="text-xl font-bold">¿Eliminar pago?</h3>
            <p className="text-on-surface-variant mt-2">Se eliminará el pago <strong>#{seleccionado?.idPago}</strong> permanentemente.</p>
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

export default Pagos;
