import api from "../api/axiosConfig";

export const getBoletas = async () => {
  const response = await api.get("/boletas");
  return response.data;
};

export const crearBoleta = async (datos) => {
  const response = await api.post("/boletas", datos);
  return response.data;
};

export const actualizarBoleta = async (id, datos) => {
  const response = await api.put(`/boletas/${id}`, datos);
  return response.data;
};

export const eliminarBoleta = async (id) => {
  await api.delete(`/boletas/${id}`);
};
