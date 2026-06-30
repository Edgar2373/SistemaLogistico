// Colores de estado del pedido
const coloresEstado = {
  EN_RUTA: { bg: "bg-[#1976D2]/10", text: "text-[#1976D2]" },
  ENTREGADO: { bg: "bg-[#43A047]/10", text: "text-[#43A047]" },
  PENDIENTE: { bg: "bg-[#FFA000]/10", text: "text-[#FFA000]" },
  CANCELADO: { bg: "bg-[#E53935]/10", text: "text-[#E53935]" },
};

function OrderRow({ id, cliente, repartidor, avatar, estado, tiempo }) {
  const colores = coloresEstado[estado] || coloresEstado.PENDIENTE;

  return (
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="px-lg py-4 font-bold text-on-surface">{id}</td>
      <td className="px-lg py-4">{cliente}</td>
      <td className="px-lg py-4 flex items-center gap-2">
        {avatar ? (
          <img className="w-6 h-6 rounded-full" src={avatar} alt={repartidor} />
        ) : (
          <div className="w-6 h-6 rounded-full bg-outline-variant flex items-center justify-center text-[10px] text-white">?</div>
        )}
        {repartidor}
      </td>
      <td className="px-lg py-4">
        <span className={`px-2 py-1 rounded ${colores.bg} ${colores.text} font-label-md`}>{estado}</span>
      </td>
      <td className="px-lg py-4 text-outline">{tiempo}</td>
      <td className="px-lg py-4">
        <button className="material-symbols-outlined text-outline hover:text-primary">visibility</button>
      </td>
    </tr>
  );
}

export default OrderRow;