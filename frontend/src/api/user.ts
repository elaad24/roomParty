import axios from "axios";
import apiClient from "./apiClient";

interface userSignupInterface {
  username: string;
  password: string;
}

export const userSignup = async ({
  username,
  password,
}: userSignupInterface) => {
  try {
    const res = await apiClient.post(`createUser`, {
      username: username,
      password: password,
    });
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

export const regenerateAccessToken = async () => {
  try {
    const response = await apiClient.get("/newAccessToken");
    return response.data.access;
  } catch (err: any) {
    console.log("error", err.response?.data || err.message || err);

    throw err;
  }
};
