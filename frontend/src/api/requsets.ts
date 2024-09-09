import { AxiosResponse } from "axios";
import apiClient from "./apiClient";

interface UserInRoomResponse {
  code: string | boolean | null;
}

export const checkUserInRoom = async (): Promise<UserInRoomResponse | any> => {
  try {
    const { data }: AxiosResponse<UserInRoomResponse> = await apiClient.get(
      "user-in-room"
    );

    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

interface createRoomProps {
  user_can_pass_songs: boolean;
  votes_to_switch_type_is_num: boolean;
  votes_to_switch: number;
}

interface CreateRoomResponse {
  id: number;
  code: string;
  host: string;
  user_can_pass_songs: boolean;
  votes_to_switch_type_is_num: boolean;
  votes_to_switch: number;
}
export const createRoom = async ({
  user_can_pass_songs,
  votes_to_switch_type_is_num,
  votes_to_switch,
}: createRoomProps): Promise<AxiosResponse<CreateRoomResponse | any>> => {
  try {
    const response: AxiosResponse<CreateRoomResponse> = await apiClient.post(
      "create-room",
      {
        user_can_pass_songs,
        votes_to_switch_type_is_num,
        votes_to_switch,
      }
    );
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

interface joinRoomProps {
  roomCode: string;
}

export const joinRoom = async ({
  roomCode,
}: joinRoomProps): Promise<AxiosResponse> => {
  try {
    const res = await apiClient.post("join-room", {
      code: roomCode,
    });
    return res;
  } catch (error: any) {
    return Promise.reject(error);
  }
};
