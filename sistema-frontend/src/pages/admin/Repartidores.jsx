import { useEffect, useMemo, useState } from "react";
import {
    createRepartidor,
    deleteRepartidor,
    getRepartidores,
    updateRepartidor
} from "../../services/repartidorService";

const estadoOptions = ["DISPONIBLE", "OCUPADO", "INACTIVO"];

const estadoStyles = {
    DISPONIBLE: "bg-green-50 text-green-700 border-green-200",
    OCUPADO: "bg-amber-50 text-amber-700 border-amber-200",
    INACTIVO: "bg-red-50 text-red-700 border-red-200"
};

const estadoLabels = {
    DISPONIBLE: "Disponible",
    OCUPADO: "Ocupado",
    INACTIVO: "Inactivo"
};

const initialForm = {
    licencia: "",
    estadoRepartidor: "DISPONIBLE",
    rendimientoPromedio: ""
};

function Repartidores() {
    const [repartidores, setRepartidores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorCargar, setErrorCargar] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [repartidorEditando, setRepartidorEditando] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [guardando, setGuardando] = useState(false);
    const [eliminandoId, setEliminandoId] = useState(null);
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: "", tipo: "success" });

    const mostrarAlerta = (mensaje, tipo = "success") => {
        setAlerta({ mostrar: true, mensaje, tipo });
        setTimeout(() => {
            setAlerta({ mostrar: false, mensaje: "", tipo: "success" });
        }, 3000);
    };

    const cargarRepartidores = async () => {
        setCargando(true);
        setErrorCargar("");
        try {
            const data = await getRepartidores();
            setRepartidores(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setErrorCargar("Error al conectar con el servidor para cargar repartidores");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        queueMicrotask(cargarRepartidores);
    }, []);

    const repartidoresFiltrados = useMemo(() => {
        const query = busqueda.trim().toLowerCase();

        return repartidores.filter((repartidor) => {
            const estado = (repartidor.estadoRepartidor || "").toUpperCase();
            const cumpleEstado = estadoFiltro ? estado === estadoFiltro : true;
            const cumpleBusqueda =
                !query ||
                String(repartidor.idRepartidor || "").includes(query) ||
                (repartidor.licencia || "").toLowerCase().includes(query) ||
                (repartidor.estadoRepartidor || "").toLowerCase().includes(query);

            return cumpleEstado && cumpleBusqueda;
        });
    }, [busqueda, estadoFiltro, repartidores]);

    const total = repartidores.length;
    const disponibles = repartidores.filter(
        (item) => (item.estadoRepartidor || "").toUpperCase() === "DISPONIBLE"
    ).length;
    const ocupados = repartidores.filter(
        (item) => (item.estadoRepartidor || "").toUpperCase() === "OCUPADO"
    ).length;
    const inactivos = repartidores.filter(
        (item) => (item.estadoRepartidor || "").toUpperCase() === "INACTIVO"
    ).length;
    const rendimientoPromedio =
        total > 0
            ? repartidores.reduce(
                (sum, item) => sum + Number(item.rendimientoPromedio || 0),
                0
            ) / total
            : 0;

    const abrirNuevo = () => {
        setRepartidorEditando(null);
        setFormData(initialForm);
        setModalAbierto(true);
    };

    const abrirEditar = (repartidor) => {
        setRepartidorEditando(repartidor);
        setFormData({
            licencia: repartidor.licencia || "",
            estadoRepartidor: (repartidor.estadoRepartidor || "DISPONIBLE").toUpperCase(),
            rendimientoPromedio: repartidor.rendimientoPromedio ?? ""
        });
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setRepartidorEditando(null);
        setFormData(initialForm);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGuardar = async (event) => {
        event.preventDefault();

        if (!formData.licencia.trim()) {
            mostrarAlerta("La licencia es obligatoria", "danger");
            return;
        }

        setGuardando(true);
        try {
            if (repartidorEditando) {
                await updateRepartidor(repartidorEditando.idRepartidor, formData);
                mostrarAlerta("Repartidor actualizado correctamente");
            } else {
                await createRepartidor(formData);
                mostrarAlerta("Repartidor creado correctamente");
            }

            await cargarRepartidores();
            cerrarModal();
        } catch (error) {
            console.error(error);
            mostrarAlerta("No se pudo guardar el repartidor", "danger");
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async (repartidor) => {
        const confirmar = window.confirm(
            `Deseas eliminar el repartidor con licencia ${repartidor.licencia || "sin licencia"}?`
        );

        if (!confirmar) return;

        setEliminandoId(repartidor.idRepartidor);
        try {
            await deleteRepartidor(repartidor.idRepartidor);
            mostrarAlerta("Repartidor eliminado correctamente", "danger");
            await cargarRepartidores();
        } catch (error) {
            console.error(error);
            mostrarAlerta("No se pudo eliminar el repartidor", "danger");
        } finally {
            setEliminandoId(null);
        }
    };

    return (
        <div className="space-y-6">
            {alerta.mostrar && (
                <div
                    className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${alerta.tipo === "danger"
                            ? "bg-red-50 border-red-300 text-red-700"
                            : "bg-green-50 border-green-300 text-green-700"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl">
                            {alerta.tipo === "danger" ? "error" : "check_circle"}
                        </span>
                        <span className="text-sm font-semibold">{alerta.mensaje}</span>
                    </div>
                </div>
            )}

            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Administracion
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-900">Repartidores</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Controla licencias, disponibilidad y rendimiento del equipo de reparto.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirNuevo}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">add</span>
                    Nuevo repartidor
                </button>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard icon="groups" label="Total" value={total} />
                <StatCard icon="check_circle" label="Disponibles" value={disponibles} />
                <StatCard icon="delivery_truck_speed" label="Ocupados" value={ocupados} />
                <StatCard icon="block" label="Inactivos" value={inactivos} />
                <StatCard
                    icon="monitoring"
                    label="Rendimiento"
                    value={`${rendimientoPromedio.toFixed(1)}%`}
                />
            </section>

            <section className="flex flex-col gap-3 p-4 bg-white border border-slate-200 rounded-lg md:flex-row md:items-center">
                <div className="flex items-center flex-1 gap-3 px-3 py-2 border border-slate-200 rounded-lg">
                    <span className="material-symbols-outlined text-slate-400">search</span>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(event) => setBusqueda(event.target.value)}
                        placeholder="Buscar por ID, licencia o estado..."
                        className="w-full text-sm bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
                    />
                </div>

                <select
                    value={estadoFiltro}
                    onChange={(event) => setEstadoFiltro(event.target.value)}
                    className="px-3 py-3 text-sm bg-white border border-slate-200 rounded-lg outline-none text-slate-700"
                >
                    <option value="">Todos los estados</option>
                    {estadoOptions.map((estado) => (
                        <option key={estado} value={estado}>
                            {estadoLabels[estado]}
                        </option>
                    ))}
                </select>

                {(busqueda || estadoFiltro) && (
                    <button
                        type="button"
                        onClick={() => {
                            setBusqueda("");
                            setEstadoFiltro("");
                        }}
                        className="px-4 py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        Limpiar
                    </button>
                )}
            </section>

            {cargando ? (
                <div className="flex items-center justify-center p-10 bg-white border border-slate-200 rounded-lg">
                    <span className="text-sm font-semibold text-slate-500">Cargando repartidores...</span>
                </div>
            ) : errorCargar ? (
                <div className="p-6 text-center text-red-800 border border-red-200 rounded-lg bg-red-50">
                    <p className="font-semibold">{errorCargar}</p>
                    <button
                        type="button"
                        onClick={cargarRepartidores}
                        className="px-4 py-2 mt-4 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        Reintentar conexion
                    </button>
                </div>
            ) : (
                <section className="overflow-hidden bg-white border border-slate-200 rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs font-bold uppercase bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-4 py-4">ID</th>
                                    <th className="px-4 py-4">Licencia</th>
                                    <th className="px-4 py-4">Estado</th>
                                    <th className="px-4 py-4">Rendimiento</th>
                                    <th className="px-4 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {repartidoresFiltrados.length > 0 ? (
                                    repartidoresFiltrados.map((repartidor) => {
                                        const estado = (repartidor.estadoRepartidor || "INACTIVO").toUpperCase();
                                        const rendimiento = Number(repartidor.rendimientoPromedio || 0);

                                        return (
                                            <tr key={repartidor.idRepartidor} className="hover:bg-slate-50">
                                                <td className="px-4 py-4 font-semibold text-slate-900">
                                                    #{repartidor.idRepartidor}
                                                </td>
                                                <td className="px-4 py-4 text-slate-700">
                                                    {repartidor.licencia || "Sin licencia"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 text-xs font-bold border rounded-full ${estadoStyles[estado] || estadoStyles.INACTIVO
                                                            }`}
                                                    >
                                                        {estadoLabels[estado] || estado}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-28 h-2 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className="h-full bg-slate-900"
                                                                style={{ width: `${Math.min(rendimiento, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-semibold text-slate-700">
                                                            {rendimiento.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => abrirEditar(repartidor)}
                                                            className="inline-flex items-center justify-center w-9 h-9 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100"
                                                            title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">edit</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEliminar(repartidor)}
                                                            disabled={eliminandoId === repartidor.idRepartidor}
                                                            className="inline-flex items-center justify-center w-9 h-9 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                                                            title="Eliminar"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                                            No se encontraron repartidores.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-950/50">
                    <div className="w-full max-w-lg bg-white rounded-lg shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {repartidorEditando ? "Editar repartidor" : "Nuevo repartidor"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Completa los datos operativos del repartidor.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={cerrarModal}
                                className="inline-flex items-center justify-center w-9 h-9 text-slate-500 rounded-lg hover:bg-slate-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleGuardar} className="px-6 py-5 space-y-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Licencia</span>
                                <input
                                    type="text"
                                    name="licencia"
                                    value={formData.licencia}
                                    onChange={handleInputChange}
                                    placeholder="Ej. A-IIb 784512"
                                    className="w-full px-3 py-3 mt-2 text-sm border border-slate-200 rounded-lg outline-none text-slate-800 focus:border-slate-500"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Estado</span>
                                <select
                                    name="estadoRepartidor"
                                    value={formData.estadoRepartidor}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-3 mt-2 text-sm bg-white border border-slate-200 rounded-lg outline-none text-slate-800 focus:border-slate-500"
                                >
                                    {estadoOptions.map((estado) => (
                                        <option key={estado} value={estado}>
                                            {estadoLabels[estado]}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">
                                    Rendimiento promedio
                                </span>
                                <input
                                    type="number"
                                    name="rendimientoPromedio"
                                    value={formData.rendimientoPromedio}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full px-3 py-3 mt-2 text-sm border border-slate-200 rounded-lg outline-none text-slate-800 focus:border-slate-500"
                                />
                            </label>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="px-4 py-3 text-sm font-bold border rounded-lg text-slate-700 border-slate-200 hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className="px-4 py-3 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-60"
                                >
                                    {guardando ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <article className="p-4 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                </div>
                <span className="flex items-center justify-center w-11 h-11 rounded-lg material-symbols-outlined bg-slate-100 text-slate-700">
                    {icon}
                </span>
            </div>
        </article>
    );
}

export default Repartidores;