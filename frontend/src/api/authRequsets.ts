import apiClient from "./apiClient";

export const regenerateAccessToken = async () => {
  try {
    const response = await apiClient.get("/newAccessToken");
    return response.data.access;
  } catch (err: any) {
    console.log("error", err.response?.data || err.message || err);

    throw err;
  }
};
