import api from "../api/axiosConfig";

export const getRepartidores = async () => {
  const response = await api.get("/repartidores");
  return response.data;
};

export const crearRepartidor = async (datos) => {
  const response = await api.post("/repartidores", datos);
  return response.data;
};

export const actualizarRepartidor = async (id, datos) => {
  const response = await api.put(`/repartidores/${id}`, datos);
  return response.data;
};

export const eliminarRepartidor = async (id) => {
  await api.delete(`/repartidores/${id}`);
};
