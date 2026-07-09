import { COLORES_ESTADO } from "../../utils/constans";

function StatusBadge({ estado, className = "" }) {
  const colores = COLORES_ESTADO[estado] || "bg-gray-100 text-gray-600";

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colores} ${className}`}>
      {estado || "-"}
    </span>
  );
}

export default StatusBadge;
