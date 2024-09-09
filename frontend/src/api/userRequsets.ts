import axios from "axios";
import apiClient from "./apiClient";
import { AxiosResponse } from "axios";

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

interface UserInRoomResponse {
  code: string | boolean | null;
}

export const checkUserInRoom = async (): Promise<UserInRoomResponse | any> => {
  try {
    const { data }: AxiosResponse<UserInRoomResponse> = await apiClient.get(
      "isUserInRoom"
    );

    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
};
