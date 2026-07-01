import { useCallback, useEffect, useMemo, useState } from "react";
import { getPedidosByRepartidor } from "../../services/pedidoService";

const estados = ["TODOS", "PENDIENTE", "EN_RUTA", "ENTREGADO", "CANCELADO"];

const estadoStyles = {
    PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
    EN_RUTA: "bg-blue-50 text-blue-700 border-blue-200",
    ENTREGADO: "bg-green-50 text-green-700 border-green-200",
    CANCELADO: "bg-red-50 text-red-700 border-red-200"
};

const normalizarEstado = (pedido) => {
    const estado =
        pedido.estado ||
        pedido.estadoPedido?.nombre ||
        pedido.estadoPedido?.estado ||
        pedido.estadoPedido?.descripcion ||
        "PENDIENTE";

    return String(estado).toUpperCase().replaceAll(" ", "_");
};

function PanelRepartidor() {
    const nombre = localStorage.getItem("nombre") || "Repartidor";
    const idRepartidor =
        localStorage.getItem("idRepartidor") || localStorage.getItem("idUsuario") || "";

    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("TODOS");

    const cargarPedidos = useCallback(async () => {
        if (!idRepartidor) {
            setPedidos([]);
            setError("No se encontro el ID del repartidor en la sesion.");
            setCargando(false);
            return;
        }

        setCargando(true);
        setError("");

        try {
            const data = await getPedidosByRepartidor(idRepartidor);
            setPedidos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar tus pedidos asignados.");
        } finally {
            setCargando(false);
        }
    }, [idRepartidor]);

    useEffect(() => {
        queueMicrotask(cargarPedidos);
    }, [cargarPedidos]);

    const pedidosFiltrados = useMemo(() => {
        const query = busqueda.trim().toLowerCase();

        return pedidos.filter((pedido) => {
            const estado = normalizarEstado(pedido);
            const cumpleEstado = estadoFiltro === "TODOS" || estado === estadoFiltro;
            const cumpleBusqueda =
                !query ||
                String(pedido.idPedido || "").includes(query) ||
                (pedido.direccionEntrega || "").toLowerCase().includes(query) ||
                (pedido.cliente?.nombre || "").toLowerCase().includes(query);

            return cumpleEstado && cumpleBusqueda;
        });
    }, [busqueda, estadoFiltro, pedidos]);

    const total = pedidos.length;
    const pendientes = pedidos.filter((pedido) => normalizarEstado(pedido) === "PENDIENTE").length;
    const enRuta = pedidos.filter((pedido) => normalizarEstado(pedido) === "EN_RUTA").length;
    const entregados = pedidos.filter((pedido) => normalizarEstado(pedido) === "ENTREGADO").length;
    const tiempoPromedio =
        total > 0
            ? pedidos.reduce((sum, pedido) => sum + Number(pedido.tiempoEstimadoEntrega || 0), 0) /
            total
            : 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-11 h-11 text-white rounded-lg material-symbols-outlined bg-slate-900">
                            local_shipping
                        </span>
                        <div>
                            <h1 className="text-xl font-bold">LogiFlow</h1>
                            <p className="text-sm text-slate-500">Panel de repartidor</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-bold">{nombre}</p>
                            <p className="text-xs text-slate-500">ID #{idRepartidor || "sin asignar"}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = "/login";
                            }}
                            className="inline-flex items-center justify-center w-10 h-10 border rounded-lg text-slate-600 border-slate-200 hover:bg-slate-100"
                            title="Cerrar sesion"
                        >
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="px-4 py-6 mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            Jornada activa
                        </p>
                        <h2 className="mt-1 text-3xl font-bold text-slate-950">
                            Tus pedidos asignados
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Revisa direcciones, tiempos estimados y estado de cada entrega.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={cargarPedidos}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white rounded-lg bg-slate-900 hover:bg-slate-800"
                    >
                        <span className="material-symbols-outlined text-xl">refresh</span>
                        Actualizar
                    </button>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard icon="assignment" label="Total" value={total} />
                    <StatCard icon="pending_actions" label="Pendientes" value={pendientes} />
                    <StatCard icon="route" label="En ruta" value={enRuta} />
                    <StatCard icon="task_alt" label="Entregados" value={entregados} />
                    <StatCard icon="schedule" label="Tiempo prom." value={`${tiempoPromedio.toFixed(0)} min`} />
                </section>

                <section className="flex flex-col gap-3 p-4 bg-white border rounded-lg border-slate-200 md:flex-row md:items-center">
                    <div className="flex items-center flex-1 gap-3 px-3 py-2 border rounded-lg border-slate-200">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(event) => setBusqueda(event.target.value)}
                            placeholder="Buscar por pedido, cliente o direccion..."
                            className="w-full text-sm bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
                        />
                    </div>

                    <select
                        value={estadoFiltro}
                        onChange={(event) => setEstadoFiltro(event.target.value)}
                        className="px-3 py-3 text-sm bg-white border rounded-lg outline-none border-slate-200 text-slate-700"
                    >
                        {estados.map((estado) => (
                            <option key={estado} value={estado}>
                                {estado === "TODOS" ? "Todos los estados" : estado.replaceAll("_", " ")}
                            </option>
                        ))}
                    </select>
                </section>

                {cargando ? (
                    <MessageCard icon="progress_activity" text="Cargando pedidos asignados..." />
                ) : error ? (
                    <section className="p-6 text-center text-red-800 border rounded-lg bg-red-50 border-red-200">
                        <p className="font-semibold">{error}</p>
                        <button
                            type="button"
                            onClick={cargarPedidos}
                            className="px-4 py-2 mt-4 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            Reintentar conexion
                        </button>
                    </section>
                ) : (
                    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        <div className="overflow-hidden bg-white border rounded-lg border-slate-200 xl:col-span-2">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs font-bold uppercase bg-slate-100 text-slate-500">
                                        <tr>
                                            <th className="px-4 py-4">Pedido</th>
                                            <th className="px-4 py-4">Direccion</th>
                                            <th className="px-4 py-4">Salida</th>
                                            <th className="px-4 py-4">Entrega</th>
                                            <th className="px-4 py-4">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pedidosFiltrados.length > 0 ? (
                                            pedidosFiltrados.map((pedido) => {
                                                const estado = normalizarEstado(pedido);

                                                return (
                                                    <tr key={pedido.idPedido} className="hover:bg-slate-50">
                                                        <td className="px-4 py-4 font-bold text-slate-950">
                                                            #{pedido.idPedido}
                                                        </td>
                                                        <td className="px-4 py-4 min-w-72">
                                                            <p className="font-semibold text-slate-800">
                                                                {pedido.direccionEntrega || "Direccion no registrada"}
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                Orden en ruta: {pedido.ordenEnRuta || "-"}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-600">
                                                            {pedido.horaSalida || "--:--"}
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-600">
                                                            {pedido.horaEntrega || "--:--"}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span
                                                                className={`inline-flex px-3 py-1 text-xs font-bold border rounded-full ${estadoStyles[estado] || estadoStyles.PENDIENTE
                                                                    }`}
                                                            >
                                                                {estado.replaceAll("_", " ")}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                                                    No hay pedidos para mostrar.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <aside className="p-5 bg-white border rounded-lg border-slate-200">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-11 h-11 rounded-lg material-symbols-outlined bg-slate-100 text-slate-700">
                                    map
                                </span>
                                <div>
                                    <h3 className="font-bold text-slate-950">Siguiente entrega</h3>
                                    <p className="text-sm text-slate-500">Prioridad por orden de ruta</p>
                                </div>
                            </div>

                            <NextDelivery pedidos={pedidosFiltrados} />
                        </aside>
                    </section>
                )}
            </main>
        </div>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <article className="p-4 bg-white border rounded-lg border-slate-200">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
                </div>
                <span className="flex items-center justify-center w-11 h-11 rounded-lg material-symbols-outlined bg-slate-100 text-slate-700">
                    {icon}
                </span>
            </div>
        </article>
    );
}

function MessageCard({ icon, text }) {
    return (
        <section className="flex items-center justify-center gap-3 p-10 bg-white border rounded-lg border-slate-200">
            <span className="material-symbols-outlined text-slate-400">{icon}</span>
            <span className="text-sm font-semibold text-slate-500">{text}</span>
        </section>
    );
}

function NextDelivery({ pedidos }) {
    const siguiente = [...pedidos]
        .filter((pedido) => normalizarEstado(pedido) !== "ENTREGADO")
        .sort((a, b) => Number(a.ordenEnRuta || 999) - Number(b.ordenEnRuta || 999))[0];

    if (!siguiente) {
        return (
            <div className="p-4 mt-5 text-sm text-center rounded-lg bg-slate-50 text-slate-500">
                No hay entregas pendientes.
            </div>
        );
    }

    return (
        <div className="mt-5 space-y-4">
            <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-xs font-bold uppercase text-slate-500">Pedido</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">#{siguiente.idPedido}</p>
            </div>

            <div>
                <p className="text-xs font-bold uppercase text-slate-500">Direccion</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                    {siguiente.direccionEntrega || "Direccion no registrada"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs font-bold uppercase text-slate-500">Orden</p>
                    <p className="mt-1 text-lg font-bold text-slate-950">
                        {siguiente.ordenEnRuta || "-"}
                    </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs font-bold uppercase text-slate-500">Tiempo</p>
                    <p className="mt-1 text-lg font-bold text-slate-950">
                        {siguiente.tiempoEstimadoEntrega || 0} min
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PanelRepartidor;
