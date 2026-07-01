import ClienteRow from "./ClienteRow";

function ClientesTable({ clientes, onEditar, onEliminar, paginaActual, totalPaginas, totalClientes, onCambioPagina }) {
  const inicio = totalClientes > 0 ? (paginaActual - 1) * 10 + 1 : 0;
  const fin = Math.min(paginaActual * 10, totalClientes);

  return (
    <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-2 sm:px-4 py-4 font-medium text-sm text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">ID</th>
              <th className="px-2 sm:px-4 py-4 font-medium text-sm text-on-surface-variant uppercase tracking-wider">Nombre</th>
              <th className="px-2 sm:px-4 py-4 font-medium text-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Teléfono</th>
              <th className="px-2 sm:px-4 py-4 font-medium text-sm text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Dirección</th>
              <th className="px-2 sm:px-4 py-4 font-medium text-sm text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {clientes.map((c) => (
              <ClienteRow
                key={c.idCliente}
                cliente={c}
                onEditar={() => onEditar(c)}
                onEliminar={() => onEliminar(c)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface border-t border-outline-variant">
        <p className="text-xs sm:text-sm sm:font-medium text-on-surface-variant">
          Mostrando <span className="font-bold text-on-surface">{inicio} - {fin}</span> de <span className="font-bold text-on-surface">{totalClientes}</span> clientes
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCambioPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => onCambioPagina(num)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                num === paginaActual
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => onCambioPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientesTable;
