function UsuarioRow({ id, nombre, usuario, email, telefono, rol, estado, onEditar }) {
  // Iniciales para el avatar
  const iniciales = nombre.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  // Color del avatar según el rol
  const coloresAvatar = {
    ADMIN: "bg-primary-fixed text-primary",
    OPERADOR: "bg-secondary-container text-secondary",
    REPARTIDOR: "bg-tertiary-fixed text-tertiary",
  };

  const colorAvatar = coloresAvatar[rol] || "bg-outline-variant text-on-surface-variant";

  return (
    <tr className="hover:bg-surface-container-lowest transition-colors h-12">
      <td className="px-2 sm:px-4 py-3 text-sm text-on-surface font-semibold hidden sm:table-cell">#{id}</td>
      <td className="px-3 sm:px-6 py-3 text-sm">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${colorAvatar} flex items-center justify-center text-xs font-bold`}>
            {iniciales}
          </div>
          <span>{nombre}</span>
        </div>
      </td>
      <td className="px-3 sm:px-6 py-3 text-sm">{usuario}</td>
      <td className="px-3 sm:px-6 py-3 text-sm text-on-surface-variant hidden md:table-cell">{email}</td>
      <td className="px-3 sm:px-6 py-3 text-sm hidden lg:table-cell">{telefono}</td>
      <td className="px-3 sm:px-6 py-3 text-sm">
        <span className="px-2 py-1 bg-surface-variant text-on-surface-variant rounded text-xs font-bold">{rol}</span>
      </td>
      {rol === "REPARTIDOR" ? (
        <td className="px-3 sm:px-6 py-3 text-sm hidden md:table-cell">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            estado === "OPERATIVO"
              ? "bg-[#43A047]/10 text-[#43A047]"
              : "bg-[#E53935]/10 text-[#E53935]"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              estado === "OPERATIVO" ? "bg-[#43A047]" : "bg-[#E53935]"
            }`}></span>
            {estado === "OPERATIVO" ? "Operativo" : "Fuera de servicio"}
          </span>
        </td>
      ) : (
        <td className="px-3 sm:px-6 py-3 text-sm hidden md:table-cell">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#43A047]/10 text-[#43A047]">
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-[#43A047]"></span>
            Operativo
          </span>
        </td>
      )}
      <td className="px-3 sm:px-6 py-3 text-right">
        <button onClick={onEditar} className="p-2 text-primary hover:bg-primary-fixed rounded transition-colors" title="Editar">
          <span className="material-symbols-outlined text-xl">edit</span>
        </button>
      </td>
    </tr>
  );
}

export default UsuarioRow;
