/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getBoletas, crearBoleta, actualizarBoleta, eliminarBoleta } from "../../services/boletaService";
import { getPedidos } from "../../services/pedidoService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function Boletas() {
  const [boletas, setBoletas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const [b, p] = await Promise.all([getBoletas(), getPedidos()]);
      setBoletas(b);
      setPedidos(p);
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

  const handleCrear = async (e) => {
    e.preventDefault(); setError("");
    const fd = new FormData(e.target);
    try {
      await crearBoleta({
        fechaEmision: fd.get("fechaEmision"),
        total: Number(fd.get("total")),
        pedido: { idPedido: Number(fd.get("idPedido")) },
      });
      setModalNuevo(false); cargar();
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear boleta");
    }
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await actualizarBoleta(seleccionado.idBoleta, {
        fechaEmision: fd.get("fechaEmision"),
        total: Number(fd.get("total")),
      });
      setModalEditar(false); setSeleccionado(null); cargar();
    } catch (err) { console.error(err); }
  };

  const handleEliminar = async () => {
    try {
      await eliminarBoleta(seleccionado.idBoleta);
      setModalEliminar(false); setSeleccionado(null); cargar();
    } catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Gestión de Boletas</h2>
          <p className="text-lg text-on-surface-variant mt-1">Boletas generadas automáticamente al registrar pedidos.</p>
        </div>
        <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-lg font-bold hover:opacity-90 shadow-sm">
          <span className="material-symbols-outlined">add</span> Nueva Boleta
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
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
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">N° Boleta</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Pedido</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Fecha Emisión</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Total</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filtradas.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-outline">No se encontraron boletas</td></tr>
              ) : (
                filtradas.map(b => (
                  <tr key={b.idBoleta} className="hover:bg-surface-container-lowest transition-colors h-12">
                    <td className="px-4 py-3 text-sm font-semibold">BOL-000{b.idBoleta}</td>
                    <td className="px-4 py-3 text-sm">Pedido #{b.pedido?.idPedido || "-"}</td>
                    <td className="px-4 py-3 text-sm">{b.fechaEmision}</td>
                    <td className="px-4 py-3 text-sm font-bold text-primary">S/ {b.total?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setSeleccionado(b); setModalEditar(true); }} className="p-2 text-primary hover:bg-primary-fixed rounded transition-colors" title="Editar">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button onClick={() => { setSeleccionado(b); setModalEliminar(true); }} className="p-2 text-error hover:bg-error-container rounded transition-colors" title="Eliminar">
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
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold">Nueva Boleta</h3>
              <button onClick={() => setModalNuevo(false)} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleCrear} className="px-6 py-4 space-y-4">
              {error && <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">{error}</div>}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pedido *</label>
                <select name="idPedido" className="w-full border border-outline-variant rounded-lg p-2" required>
                  <option value="">Seleccione un pedido...</option>
                  {pedidos.map(p => (
                    <option key={p.idPedido} value={p.idPedido}>
                      Pedido #{p.idPedido} - {p.cliente?.nombre} - S/ {p.costoEnvio}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Fecha Emisión *</label>
                  <input name="fechaEmision" type="date" className="w-full border border-outline-variant rounded-lg p-2" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Total (S/) *</label>
                  <input name="total" type="number" step="0.01" className="w-full border border-outline-variant rounded-lg p-2" required />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalNuevo(false)} className="px-4 py-2 rounded-lg font-bold border border-outline-variant">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEditar && seleccionado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold">Editar Boleta BOL-000{seleccionado.idBoleta}</h3>
              <button onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleActualizar} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Fecha</label>
                <input name="fechaEmision" type="date" defaultValue={seleccionado.fechaEmision} className="w-full border border-outline-variant rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Total (S/)</label>
                <input name="total" type="number" step="0.01" defaultValue={seleccionado.total} className="w-full border border-outline-variant rounded-lg p-2" />
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
            <h3 className="text-xl font-bold">¿Eliminar boleta?</h3>
            <p className="text-on-surface-variant mt-2">Se eliminará la boleta <strong>BOL-000{seleccionado?.idBoleta}</strong> permanentemente.</p>
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

export default Boletas;
