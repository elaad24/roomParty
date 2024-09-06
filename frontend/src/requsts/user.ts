import axios from "axios";
import { backendUrl } from "./url";

interface userSignupInterface {
  username: string;
  password: string;
}

export const userSignup = async ({
  username,
  password,
}: userSignupInterface) => {
  try {
    const res = await axios.post(`${backendUrl}createUser`, {
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
