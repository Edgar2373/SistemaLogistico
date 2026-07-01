function ClienteRow({ cliente, onEditar, onEliminar }) {
  const { idCliente, nombre, telefono, direccionPrincipal } = cliente;

  const iniciales = nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <tr className="hover:bg-surface-container-lowest transition-colors h-12">
      <td className="px-2 sm:px-4 py-3 text-sm text-on-surface font-semibold hidden sm:table-cell">#{idCliente}</td>
      <td className="px-3 sm:px-6 py-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-dim flex items-center justify-center text-on-surface-variant font-bold text-xs">
            {iniciales}
          </div>
          <span>{nombre}</span>
        </div>
      </td>
      <td className="px-3 sm:px-6 py-3 text-sm text-on-surface-variant hidden md:table-cell">{telefono}</td>
      <td className="px-3 sm:px-6 py-3 text-sm text-on-surface-variant hidden lg:table-cell">{direccionPrincipal}</td>
      <td className="px-3 sm:px-6 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={onEditar} className="p-2 text-primary hover:bg-primary-fixed rounded transition-colors" title="Editar">
            <span className="material-symbols-outlined text-xl">edit</span>
          </button>
          <button onClick={onEliminar} className="p-2 text-error hover:bg-error-container rounded transition-colors" title="Eliminar">
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ClienteRow;
