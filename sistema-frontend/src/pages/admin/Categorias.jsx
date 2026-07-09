/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getCategorias, crearCategoria, eliminarCategoria } from "../../services/categoriaService";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");

  const cargar = async () => { try { setCategorias(await getCategorias()); } catch (e) { console.error(e); } };

  useEffect(() => { cargar(); }, []);

  const handleCrear = async (e) => {
    e.preventDefault(); setError(""); const fd = new FormData(e.target);
    const nombre = fd.get("nombreCategoria");
    if (!nombre) { setError("El nombre es obligatorio"); return; }
    try { await crearCategoria({ nombreCategoria: nombre }); setModalNuevo(false); cargar(); } catch (err) { setError(err.response?.data?.error || "Error al crear"); }
  };

  const handleEliminar = async () => {
    try { await eliminarCategoria(seleccionado.idCategoria); setModalEliminar(false); setSeleccionado(null); cargar(); } catch (err) { console.error(err); }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Gestión de Categorías</h2>
          <p className="text-lg text-on-surface-variant mt-1">Administra las categorías de productos.</p>
        </div>
        <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-lg font-bold hover:opacity-90 shadow-sm">
          <span className="material-symbols-outlined">add</span> Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map(c => (
          <div key={c.idCategoria} className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">category</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-lg">{c.nombreCategoria}</p>
                <p className="text-sm text-outline">ID: #{c.idCategoria}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-outline-variant">
              <button onClick={() => { setSeleccionado(c); setModalEliminar(true); }} className="flex-1 py-2 text-sm font-bold text-error hover:bg-error-container rounded-lg transition-colors">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {modalNuevo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold">Nueva Categoría</h3>
              <button onClick={() => setModalNuevo(false)} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleCrear} className="px-6 py-4 space-y-4">
              {error && <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">{error}</div>}
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Nombre de Categoría</label><input name="nombreCategoria" className="w-full border border-outline-variant rounded-lg p-2" placeholder="Ej. Electrónica" required /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalNuevo(false)} className="px-4 py-2 rounded-lg font-bold border border-outline-variant">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEliminar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-4xl">warning</span></div>
            <h3 className="text-xl font-bold">¿Eliminar categoría?</h3>
            <p className="text-on-surface-variant mt-2">Se eliminará <strong>{seleccionado?.nombreCategoria}</strong> permanentemente.</p>
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

export default Categorias;
