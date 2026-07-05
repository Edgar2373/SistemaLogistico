/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from "../../services/productoService";
import { getCategorias } from "../../services/categoriaService";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");

  const cargarProductos = async () => {
    try { setProductos(await getProductos()); } catch (e) { console.error(e); }
  };

  const cargarCategorias = async () => {
    try { setCategorias(await getCategorias()); } catch (e) { console.error(e); }
  };

  useEffect(() => { cargarProductos(); cargarCategorias(); }, []);

  const filtrados = busqueda
    ? productos.filter(p => p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()))
    : productos;

  const paginados = filtrados.slice((paginaActual - 1) * 10, paginaActual * 10);
  const totalPaginas = Math.ceil(filtrados.length / 10);

  const handleCrear = async (e) => {
    e.preventDefault(); setError("");
    const fd = new FormData(e.target);
    const nombre = fd.get("nombreProducto");
    const precio = fd.get("precio");
    const stock = fd.get("stock");
    const idCategoria = fd.get("idCategoria");

    if (!nombre || !precio || !stock || !idCategoria) { setError("Todos los campos son obligatorios"); return; }
    if (Number(precio) <= 0) { setError("El precio debe ser mayor a 0"); return; }
    if (Number(stock) <= 0) { setError("El stock debe ser mayor a 0"); return; }

    try {
      await crearProducto({ nombreProducto: nombre, precio: Number(precio), stock: Number(stock), categoria: { idCategoria: Number(idCategoria) } });
      setModalNuevo(false); cargarProductos();
    } catch (err) {
      const msg = err.response?.data?.error || Object.values(err.response?.data || {}).join(". ");
      setError(msg || "Error al crear");
    }
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await actualizarProducto(seleccionado.idProducto, {
        nombreProducto: fd.get("nombreProducto"), precio: Number(fd.get("precio")),
        stock: Number(fd.get("stock")), categoria: { idCategoria: Number(fd.get("idCategoria")) }
      });
      setModalEditar(false); setSeleccionado(null); cargarProductos();
    } catch (err) { console.error(err); }
  };

  const handleEliminar = async () => {
    try { await eliminarProducto(seleccionado.idProducto); setModalEliminar(false); setSeleccionado(null); cargarProductos(); } catch (err) { console.error(err); }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Gestión de Productos</h2>
          <p className="text-lg text-on-surface-variant mt-1">Administra el catálogo de productos.</p>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar producto..." className="bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-lg font-bold hover:opacity-90 transition-all shadow-sm">
            <span className="material-symbols-outlined">add</span> Nuevo Producto
          </button>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">ID</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Nombre</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden md:table-cell">Precio</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden md:table-cell">Stock</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden lg:table-cell">Categoría</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {paginados.map(p => (
                <tr key={p.idProducto} className="hover:bg-surface-container-lowest transition-colors h-12">
                  <td className="px-4 py-3 text-sm font-semibold hidden sm:table-cell">#{p.idProducto}</td>
                  <td className="px-4 py-3 text-sm">{p.nombreProducto}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">S/ {p.precio}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{p.stock}</td>
                  <td className="px-4 py-3 text-sm hidden lg:table-cell">{p.categoria?.nombreCategoria || "-"}</td>
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
        {totalPaginas > 1 && (
          <div className="px-4 py-3 flex items-center justify-between bg-surface border-t border-outline-variant">
            <p className="text-sm text-on-surface-variant">Página {paginaActual} de {totalPaginas}</p>
            <div className="flex gap-1">
              <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1} className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant disabled:opacity-50"><span className="material-symbols-outlined">chevron_left</span></button>
              <button onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas} className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant disabled:opacity-50"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
        )}
      </div>

      {modalNuevo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold">Nuevo Producto</h3>
              <button onClick={() => setModalNuevo(false)} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleCrear} className="px-6 py-4 space-y-4">
              {error && <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">{error}</div>}
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Nombre</label><input name="nombreProducto" className="w-full border border-outline-variant rounded-lg p-2" placeholder="Nombre del producto" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Precio (S/)</label><input name="precio" type="number" step="0.01" className="w-full border border-outline-variant rounded-lg p-2" placeholder="0.00" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Stock</label><input name="stock" type="number" className="w-full border border-outline-variant rounded-lg p-2" placeholder="0" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Categoría</label>
                <select name="idCategoria" className="w-full border border-outline-variant rounded-lg p-2">
                  <option value="">Seleccione...</option>
                  {categorias.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>)}
                </select>
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
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold">Editar Producto</h3>
              <button onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleActualizar} className="px-6 py-4 space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Nombre</label><input name="nombreProducto" defaultValue={seleccionado.nombreProducto} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Precio (S/)</label><input name="precio" type="number" step="0.01" defaultValue={seleccionado.precio} className="w-full border border-outline-variant rounded-lg p-2" /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Stock</label><input name="stock" type="number" defaultValue={seleccionado.stock} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Categoría</label>
                <select name="idCategoria" defaultValue={seleccionado.categoria?.idCategoria} className="w-full border border-outline-variant rounded-lg p-2">
                  {categorias.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>)}
                </select>
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
            <h3 className="text-xl font-bold">¿Eliminar producto?</h3>
            <p className="text-on-surface-variant mt-2">Se eliminará <strong>{seleccionado?.nombreProducto}</strong> permanentemente.</p>
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

export default Productos;
