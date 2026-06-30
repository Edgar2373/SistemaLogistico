function UsuarioRow({ usuario, onEdit, onDelete }) {
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Badge styles based on role
  const roleStyles = {
    ADMIN: "bg-surface-variant text-on-surface-variant",
    OPERADOR: "bg-primary-fixed text-primary",
    REPARTIDOR: "bg-secondary-container text-secondary-fixed-dim text-secondary", // combination of green container and secondary
  };

  // Badge styles based on status
  const statusStyles = {
    Activo: {
      bg: "bg-[#43A047]/10 text-[#43A047]",
      dot: "bg-[#43A047]",
    },
    Inactivo: {
      bg: "bg-[#E53935]/10 text-[#E53935]",
      dot: "bg-[#E53935]",
    },
    Pendiente: {
      bg: "bg-[#FFA000]/10 text-[#FFA000]",
      dot: "bg-[#FFA000]",
    },
  };

  const status = usuario.estadoUsuario || "Activo";
  const stStyle = statusStyles[status] || statusStyles.Activo;

  return (
    <tr className="hover:bg-surface-container-lowest transition-colors h-14">
      <td className="px-6 py-4 font-semibold text-on-surface">
        #LF-{usuario.idUsuario}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-xs font-bold">
            {getInitials(usuario.nombre)}
          </div>
          <span className="font-semibold text-on-surface">{usuario.nombre}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-on-surface-variant">{usuario.usuario}</td>
      <td className="px-6 py-4 text-on-surface-variant">{usuario.email}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded text-xs font-bold ${roleStyles[usuario.rol] || "bg-gray-100 text-gray-800"}`}>
          {usuario.rol}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stStyle.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${stStyle.dot} mr-1.5`}></span>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(usuario)}
            className="p-1.5 text-primary hover:bg-primary-fixed rounded transition-colors cursor-pointer"
            title="Editar"
          >
            <span className="material-symbols-outlined text-xl">edit</span>
          </button>
          <button
            onClick={() => onDelete(usuario)}
            className="p-1.5 text-error hover:bg-error-container rounded transition-colors cursor-pointer"
            title="Eliminar"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UsuarioRow;
