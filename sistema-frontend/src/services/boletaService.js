import api from "../api/axiosConfig";

export const getBoletas = async () => {
  const response = await api.get("/boletas");
  return response.data;
};

export const getBoletaPorId = async (id) => {
  const response = await api.get(`/boletas/${id}`);
  return response.data;
};
