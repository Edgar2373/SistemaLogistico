import api from "../api/axiosConfig";

export const getDashboardMetrics = async () => {
  const response = await api.get("/pedidos");
  return response.data;
};
