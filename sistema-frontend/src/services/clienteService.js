import api from "../api/axiosConfig";

export const getClientes = async () => {
  const response = await api.get("/clientes");
  return response.data;
};

export const crearCliente = async (datos) => {
  const response = await api.post("/clientes", datos);
  return response.data;
};

export const actualizarCliente = async (id, datos) => {
  const response = await api.put(`/clientes/${id}`, datos);
  return response.data;
};

export const eliminarCliente = async (id) => {
  await api.delete(`/clientes/${id}`);
};
