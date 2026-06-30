import UsuarioRow from "./UsuarioRow";

function UsuariosTable({ usuarios = [], onEdit, onDelete }) {
  return (
    <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-on-surface-variant">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              usuarios.map((usr) => (
                <UsuarioRow
                  key={usr.idUsuario}
                  usuario={usr}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Barra de paginación */}
      <div className="px-6 py-4 flex items-center justify-between bg-surface border-t border-outline-variant">
        <p className="text-xs text-on-surface-variant">
          Mostrando <span className="font-bold text-on-surface">1 - {usuarios.length}</span> de{" "}
          <span className="font-bold text-on-surface">{usuarios.length}</span> usuarios
        </p>
        <div className="flex items-center gap-1.5">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer"
            disabled
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold">
            1
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer"
            disabled
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UsuariosTable;
