import { AxiosResponse } from "axios";
import apiClient from "./apiClient";
import { apiRoute } from "./url";

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
      `${apiRoute}createRoom`,
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
    const res = await apiClient.post(`${apiRoute}joinRoom`, {
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
      `${apiRoute}getRoomInfo/?room_key=${room_key}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

interface voteForCurrentSong {
  room_key: string;
  active_song_id: string;
  vote_type: "1" | "0";
}
export const voteForCurrentSong = async ({
  room_key,
  active_song_id,
  vote_type,
}: Partial<voteForCurrentSong>): Promise<AxiosResponse> => {
  try {
    const res = await apiClient.post(`${apiRoute}vote`, {
      room_key,
      active_song_id,
      vote_type,
    });
    return res;
  } catch (error: any) {
    return Promise.reject(error);
  }
};

interface suggestSong {
  room_key: string;
  suggested_songs_id: string;
  suggested_songs_img: string;
}

export const suggestSong = async ({
  room_key,
  suggested_songs_id,
  suggested_songs_img,
}: suggestSong): Promise<AxiosResponse> => {
  try {
    const res = await apiClient.post(`${apiRoute}suggestSong`, {
      room_key,
      suggested_songs_id,
      suggested_songs_img,
    });
    return res;
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const voteForSuggestSong = async ({
  room_key,
  suggested_songs_id,
}: Partial<suggestSong>): Promise<AxiosResponse> => {
  try {
    const res = await apiClient.post(`${apiRoute}suggestSongVote`, {
      room_key,
      suggested_songs_id,
    });
    return res;
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export interface userSuggestSongsVotes {
  room_key: string;
  suggested_songs_id: string;
  username: string;
}

export const getUserVoteOnSuggestedSongs = async ({
  room_key,
}: checkRoomIsExist): Promise<userSuggestSongsVotes[] | any> => {
  try {
    const response: AxiosResponse<RoomResponse> = await apiClient.get(
      `${apiRoute}suggestSongUserVote/?room_key=${room_key}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
