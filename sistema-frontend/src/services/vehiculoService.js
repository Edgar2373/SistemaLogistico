import api from "../api/axiosConfig";

export const getVehiculos = async () => {
  const response = await api.get("/vehiculos");
  return response.data;
};

export const crearVehiculo = async (datos) => {
  const response = await api.post("/vehiculos", datos);
  return response.data;
};

export const actualizarVehiculo = async (id, datos) => {
  const response = await api.put(`/vehiculos/${id}`, datos);
  return response.data;
};

export const eliminarVehiculo = async (id) => {
  await api.delete(`/vehiculos/${id}`);
};
