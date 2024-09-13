import apiClient from "./apiClient";
import { apiRoute } from "./url";

export const regenerateAccessToken = async () => {
  try {
    const response = await apiClient.get(`${apiRoute}newAccessToken`);
    return response.data.access;
  } catch (err: any) {
    console.log("error", err.response?.data || err.message || err);

    throw err;
  }
};
