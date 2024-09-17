import axios from "axios";
import apiClient from "./apiClient";
import { getCookie } from "../utils/helpers";
import { spotifyRoute } from "./url";

interface spotifySearchProps {
  text: string;
}

export const spotifySearchItem = async ({ text }: spotifySearchProps) => {
  const { data } = await apiClient.get(`${spotifyRoute}search-song?q=${text}`);
  if (data) {
    return data;
  } else {
    return Error("error in searching for song ");
  }
};

interface authenticateSpotifyProps {
  spotifyAuthenticatedStateSetter: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export const authenticateSpotify = async ({
  spotifyAuthenticatedStateSetter,
}: authenticateSpotifyProps) => {
  const { data } = await apiClient.get(`${spotifyRoute}is-Authenticated`);
  spotifyAuthenticatedStateSetter(data.status);
  if (!data.status) {
    const { data } = await apiClient.get(`${spotifyRoute}get-auth-url`);
    window.location.replace(data.url);
  }
};

interface setSpotifyUserNameProps {
  encryptedToken: string;
}

export const setSpotifyUserName = async ({
  encryptedToken,
}: setSpotifyUserNameProps) => {
  try {
    await apiClient.post(`${spotifyRoute}set-spotify-username`, {
      secret_token: encryptedToken,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCurrentSong = async () => {
  try {
    const { data } = await apiClient.get(`${spotifyRoute}current-song`);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};
