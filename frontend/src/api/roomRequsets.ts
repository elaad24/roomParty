import { AxiosResponse } from "axios";
import apiClient from "./apiClient";

interface createRoomProps {
  user_can_pass_songs: boolean;
  votes_to_switch_type_is_num: boolean;
  votes_to_switch: number;
}

export interface RoomResponse {
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
}: createRoomProps): Promise<AxiosResponse<RoomResponse | any>> => {
  try {
    const response: AxiosResponse<RoomResponse> = await apiClient.post(
      "createRoom",
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
    const res = await apiClient.post("joinRoom", {
      code: roomCode,
    });
    return res;
  } catch (error: any) {
    return Promise.reject(error);
  }
};

interface checkRoomIsExist {
  room_key: string;
}

export const checkRoomIsExist = async ({
  room_key,
}: checkRoomIsExist): Promise<RoomResponse | any> => {
  try {
    const response: AxiosResponse<RoomResponse> = await apiClient.get(
      `geRoomInfo/room_key=${room_key}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
