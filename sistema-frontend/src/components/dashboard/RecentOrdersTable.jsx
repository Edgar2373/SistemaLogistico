import OrderRow from "./OrderRow";

// Datos de ejemplo (luego se conectan a la API)
const pedidosRecientes = [
  { id: "#LF-8821", cliente: "Supermercado El Sol", repartidor: "Carlos Ruiz", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFA2Bmq3QvB3C2aAG6g9fshJbwFVdwfk4b3GJ1FAW4Q8saYew2LazNjDE8k4wJob8wC0Fzdsn8Vf749XXKo4ucJwrecHEqFilZQeMWE-IUWnHluWLD6U_wze2BEeicMtayGjE2_EXefX-v2pDmOgHyZ1Dmo_EBhjWekG5aiB44YmpT5ne43Z8V9G_gZ1Kh-GBgMMcLi25-wITU2OorGvX9L2Ph4UztTREUmsd_WgEDk5MXPUiut8fTJh55CX-o51x-0m1gajyyHT1_", estado: "EN_RUTA", tiempo: "12 min" },
  { id: "#LF-8819", cliente: "Farmacia Central", repartidor: "Marta López", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCY9hxcCwfz_MSP94q9LrwjEABDLTYt6MlgMHBnRtz1zbqm9O6YxPuka3s0HFJ-HUIbor9mUZkvMRLTgKYqEjfQ3VrEdviejUcGNHSH3dHPMYwrBHOHt8WPt1DghSo8JC8rHngzubW4FHfWCQIyt0OlddZDRi_l7pSfHVWESpBMREgv2secd6IC22Ix5cISG51qFKHid8wxdTDRNAS9fqMR37GFuWY-r1i_95-150vnzHsULZOUhe1mVVPeU3kxpdaD8lfrIhjImPcr", estado: "ENTREGADO", tiempo: "45 min" },
  { id: "#LF-8815", cliente: "Restaurante Gourmet", repartidor: "Sin asignar", avatar: null, estado: "PENDIENTE", tiempo: "--" },
];

function RecentOrdersTable() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden px-4 py-4">
      <div className="p-lg border-b border-outline-variant flex justify-between items-center">
        <h4 className="font-bold text-xl text-on-surface py-2">Pedidos Recientes</h4>
        <button className="text-primary font-bold text-xl hover:underline">Ver todo</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container text-label-md text-on-surface-variant">
              <th className="px-lg py-3">ID Pedido</th>
              <th className="px-lg py-3">Cliente</th>
              <th className="px-lg py-3">Repartidor</th>
              <th className="px-lg py-3">Estado</th>
              <th className="px-lg py-3">Tiempo</th>
              <th className="px-lg py-3">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant text-table-data">
            {pedidosRecientes.map((pedido) => (
              <OrderRow key={pedido.id} {...pedido} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrdersTable;