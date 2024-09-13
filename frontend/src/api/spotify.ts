import axios from "axios";
import apiClient from "./apiClient";
import { getCookie } from "../utils/helpers";
import { spotifyRoute } from "./url";

interface spotifySearchProps {
  text: string;
}

export const spotifySearchItem = async ({ text }: spotifySearchProps) => {
  const token = getCookie("spotifyAccessToken");
  if (!token || token == null) {
    console.log("error - not spotify access token ");
    return;
  }
  const response = await axios.get(
    `https://api.spotify.com/v1/search?q=${text}&type=track%2Cartist%2Calbum&limit=10&offset=0&include_external=audio0`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
