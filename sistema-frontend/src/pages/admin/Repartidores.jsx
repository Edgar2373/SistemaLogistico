/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getRepartidores, crearRepartidor, actualizarRepartidor } from "../../services/repartidorService";

function Repartidores() {
  const [repartidores, setRepartidores] = useState([]);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [error, setError] = useState("");

  const cargar = async () => {
    try { setRepartidores(await getRepartidores()); } catch (e) { console.error(e); }
  };

  useEffect(() => { cargar(); }, []);

  const handleCrear = async (e) => {
    e.preventDefault(); setError("");
    const fd = new FormData(e.target);
    const licencia = fd.get("licencia");
    const estado = fd.get("estadoRepartidor");
    if (!licencia || !estado) { setError("Todos los campos son obligatorios"); return; }
    try {
      await crearRepartidor({ licencia, estadoRepartidor: estado, rendimientoPromedio: Number(fd.get("rendimientoPromedio") || 0) });
      setModalNuevo(false); cargar();
    } catch (err) { setError(err.response?.data?.error || "Error al crear"); }
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await actualizarRepartidor(seleccionado.idRepartidor, { licencia: fd.get("licencia"), estadoRepartidor: fd.get("estadoRepartidor"), rendimientoPromedio: Number(fd.get("rendimientoPromedio")) });
      setModalEditar(false); setSeleccionado(null); cargar();
    } catch (err) { console.error(err); }
  };

  const coloresEstado = { DISPONIBLE: "bg-[#43A047]/10 text-[#43A047]", OCUPADO: "bg-[#FFA000]/10 text-[#FFA000]", INACTIVO: "bg-[#E53935]/10 text-[#E53935]" };

  const repartidoresVinculados = repartidores.filter(r => r.usuario != null);
  const repartidoresFiltrados = filtroEstado
    ? repartidoresVinculados.filter((r) => r.estadoRepartidor === filtroEstado)
    : repartidoresVinculados;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Repartidores</h2>
          <p className="text-lg text-on-surface-variant mt-1">Lista de repartidores vinculados a usuarios.</p>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <div className="relative group">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="appearance-none bg-surface border border-outline-variant rounded-lg px-3 py-4 pr-10 text-base font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="">Todos los estados</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="OCUPADO">Ocupado</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">filter_list</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repartidoresFiltrados.map(r => (
          <div key={r.idRepartidor} className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">{r.usuario?.nombre?.charAt(0).toUpperCase() || "R"}</div>
              <div>
                <p className="font-bold text-on-surface">{r.usuario?.nombre || `Repartidor #${r.idRepartidor}`}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${coloresEstado[r.estadoRepartidor] || "bg-gray-100 text-gray-600"}`}>{r.estadoRepartidor}</span>
              </div>
            </div>
            <div className="text-sm text-on-surface-variant space-y-1">
              <p>Licencia: <strong>{r.licencia}</strong></p>
              <p>Rendimiento: <strong>{r.rendimientoPromedio || 0}%</strong></p>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-outline-variant">
              <button onClick={() => { setSeleccionado(r); setModalEditar(true); }} className="flex-1 py-2 text-sm font-bold text-primary hover:bg-primary-fixed rounded-lg transition-colors">Editar</button>
            </div>
          </div>
        ))}
      </div>

      {modalNuevo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold">Nuevo Repartidor</h3>
              <button onClick={() => setModalNuevo(false)} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleCrear} className="px-6 py-4 space-y-4">
              {error && <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">{error}</div>}
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Tipo de Licencia</label>
                <select name="licencia" className="w-full border border-outline-variant rounded-lg p-2" required>
                  <option value="">Seleccione...</option>
                  <option value="A-1">A-1 (Motos)</option>
                  <option value="A-2A">A-2A (Autos particulares)</option>
                  <option value="A-2B">A-2B (Taxis)</option>
                  <option value="A-3A">A-3A (Camiones &lt; 4T)</option>
                  <option value="A-3B">A-3B (Camiones &gt; 4T)</option>
                  <option value="B-1">B-1 (Buses &lt; 8 pasajeros)</option>
                  <option value="B-2">B-2 (Buses &gt; 8 pasajeros)</option>
                  <option value="C-1">C-1 (Remolques)</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                <select name="estadoRepartidor" className="w-full border border-outline-variant rounded-lg p-2" required>
                  <option value="">Seleccione...</option>
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="OCUPADO">Ocupado</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Rendimiento Promedio</label><input name="rendimientoPromedio" type="number" step="0.1" defaultValue="0" className="w-full border border-outline-variant rounded-lg p-2" /></div>
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
              <h3 className="text-xl font-bold">Editar Repartidor #{seleccionado.idRepartidor}</h3>
              <button onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleActualizar} className="px-6 py-4 space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Tipo de Licencia</label>
                <select name="licencia" defaultValue={seleccionado.licencia} className="w-full border border-outline-variant rounded-lg p-2">
                  <option value="A-1">A-1 (Motos)</option>
                  <option value="A-2A">A-2A (Autos particulares)</option>
                  <option value="A-2B">A-2B (Taxis)</option>
                  <option value="A-3A">A-3A (Camiones &lt; 4T)</option>
                  <option value="A-3B">A-3B (Camiones &gt; 4T)</option>
                  <option value="B-1">B-1 (Buses &lt; 8 pasajeros)</option>
                  <option value="B-2">B-2 (Buses &gt; 8 pasajeros)</option>
                  <option value="C-1">C-1 (Remolques)</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                <select name="estadoRepartidor" defaultValue={seleccionado.estadoRepartidor} className="w-full border border-outline-variant rounded-lg p-2">
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="OCUPADO">Ocupado</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Rendimiento</label><input name="rendimientoPromedio" type="number" step="0.1" defaultValue={seleccionado.rendimientoPromedio} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="px-4 py-2 rounded-lg font-bold border border-outline-variant">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </>
  );
}

export default Repartidores;
