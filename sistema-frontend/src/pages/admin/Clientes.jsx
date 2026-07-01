import { useState, useEffect } from "react";
import { getClientes, crearCliente, actualizarCliente, eliminarCliente } from "../../services/clienteService";
import ClientesHeader from "../../components/clientes/ClientesHeader";
import ClientesStats from "../../components/clientes/ClientesStats";
import ClientesTable from "../../components/clientes/ClientesTable";
import NuevoClienteModal from "../../components/clientes/NuevoClienteModal";
import EditarClienteModal from "../../components/clientes/EditarClienteModal";
import ConfirmDeleteModal from "../../components/clientes/ConfirmDeleteModal";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
      setTotalPaginas(Math.ceil(data.length / 10));
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  const clientesFiltrados = busqueda
    ? clientes.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.telefono.includes(busqueda)
      )
    : clientes;

  const clientesPagina = clientesFiltrados.slice(
    (paginaActual - 1) * 10,
    paginaActual * 10
  );

  const total = clientes.length;

  const handleGuardarNuevo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevoCliente = {
      nombre: formData.get("nombre"),
      telefono: formData.get("telefono"),
      direccionPrincipal: formData.get("direccionPrincipal"),
    };
    try {
      await crearCliente(nuevoCliente);
      setModalNuevo(false);
      cargarClientes();
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  const handleEditar = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalEditar(true);
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const datosActualizados = {
      nombre: formData.get("nombre"),
      telefono: formData.get("telefono"),
      direccionPrincipal: formData.get("direccionPrincipal"),
    };
    try {
      await actualizarCliente(clienteSeleccionado.idCliente, datosActualizados);
      setModalEditar(false);
      setClienteSeleccionado(null);
      cargarClientes();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleEliminar = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalEliminar(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarCliente(clienteSeleccionado.idCliente);
      setModalEliminar(false);
      setClienteSeleccionado(null);
      cargarClientes();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <>
      <ClientesHeader
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onNuevoCliente={() => setModalNuevo(true)}
      />

      <ClientesStats total={total} />

      <ClientesTable
        clientes={clientesPagina}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        totalClientes={clientesFiltrados.length}
        onCambioPagina={setPaginaActual}
      />

      <NuevoClienteModal
        visible={modalNuevo}
        onClose={() => setModalNuevo(false)}
        onGuardar={handleGuardarNuevo}
      />

      <EditarClienteModal
        visible={modalEditar}
        onClose={() => { setModalEditar(false); setClienteSeleccionado(null); }}
        onGuardar={handleActualizar}
        cliente={clienteSeleccionado}
      />

      <ConfirmDeleteModal
        visible={modalEliminar}
        onClose={() => { setModalEliminar(false); setClienteSeleccionado(null); }}
        onConfirmar={confirmarEliminar}
        nombreCliente={clienteSeleccionado?.nombre || ""}
      />
    </>
  );
}

export default Clientes;
