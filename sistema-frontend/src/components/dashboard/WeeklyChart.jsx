import { useEffect, useRef } from "react";

// Datos del gráfico: día, cantidad de pedidos, porcentaje de altura
const dias = [
  { label: "Lun", pedidos: 45, altura: "45%" },
  { label: "Mar", pedidos: 60, altura: "60%" },
  { label: "Mie", pedidos: 85, altura: "85%" },
  { label: "Jue", pedidos: 55, altura: "55%" },
  { label: "Vie", pedidos: 95, altura: "95%" },
  { label: "Sab", pedidos: 30, altura: "30%" },
  { label: "Dom", pedidos: 15, altura: "15%" },
];

function WeeklyChart() {
  const chartRef = useRef(null);

  // Animación de barras al cargar
  useEffect(() => {
    const bars = chartRef.current?.querySelectorAll(".chart-bar");
    if (!bars) return;
    bars.forEach((bar) => {
      const height = bar.style.height;
      bar.style.height = "0%";
      setTimeout(() => { bar.style.height = height; }, 200);
    });
  }, []);

  return (
    <div className="lg:col-span-2 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm px-4 py-4 gap-6">
      <div className="flex justify-between items-center mb-lg">
        <h4 className="font-bold text-xl text-on-surface">Entregas Semanales</h4>
        <select className="bg-surface-container-low border-none rounded-lg text-label-md focus:ring-primary">
          <option>Últimos 7 días</option>
          <option>Último mes</option>
        </select>
      </div>

      <div ref={chartRef} className="h-64 flex items-end justify-between gap-2 px-2">
        {dias.map((dia) => (
          <div key={dia.label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-primary-container/20 rounded-t-lg relative group">
              <div
                className="bg-primary w-full rounded-t-lg chart-bar absolute bottom-0"
                style={{ height: dia.altura }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-on-background text-white text-[10px] py-1 px-2 rounded whitespace-nowrap transition-opacity">
                  {dia.pedidos} Pedidos
                </div>
              </div>
            </div>
            <span className="text-label-md text-outline">{dia.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyChart;