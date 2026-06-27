import UsuarioRow from "./UsuarioRow";

function UsuariosTable({ usuarios, onEditar, onEliminar, paginaActual, totalPaginas, onCambioPagina }) {
  return (
    <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-2 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">ID</th>
              <th className="px-2 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Nombre</th>
              <th className="px-2 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Usuario</th>
              <th className="px-2 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Email</th>
              <th className="px-2 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Teléfono</th>
              <th className="px-2 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Rol</th>
              <th className="px-2 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">Estado</th>
              <th className="px-2 py-4 font-label-md text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {usuarios.map((u) => (
              <UsuarioRow
                key={u.idUsuario}
                id={u.idUsuario}
                nombre={u.nombre}
                usuario={u.usuario}
                email={u.email}
                telefono={u.telefono}
                rol={u.rol}
                estado={u.estadoUsuario}
                onEditar={() => onEditar(u)}
                onEliminar={() => onEliminar(u)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="px-6 py-4 flex items-center justify-between bg-surface border-t border-outline-variant">
        <p className="text-label-md text-on-surface-variant">
          Mostrando <span className="font-bold text-on-surface">{(paginaActual - 1) * 10 + 1} - {Math.min(paginaActual * 10, usuarios.length)}</span> de <span className="font-bold text-on-surface">{usuarios.length}</span> usuarios
        </p>
        <div className="flex items-center gap-base">
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

export default UsuariosTable;