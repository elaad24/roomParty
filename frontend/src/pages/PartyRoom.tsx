import React, { useEffect, useState } from "react";
import { getUser } from "../api/userRequsets";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkRoomIsExist,
  getRoomSongsQueue,
  getSuggestedSongs,
  RoomResponse,
  roomSongsQueueInterface,
  sseUrl,
} from "../api/roomRequsets";

import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import CurrentSongBox from "../components/CurrentSongBox";
import SuggestedSongsBox from "../components/SuggestedSongsBox";
import SongsQueue from "../components/SongsQueue";
import SuggestSongBox from "../components/SuggestSongBox";
import {
  authenticateSpotify,
  getCurrentSong,
  getSpotifyAccessToken,
} from "../api/spotify";
import { getCookie } from "../utils/helpers";
import LiveAnimations, { LiveAnimationsProps } from "../components/Animation";

export interface currentSongDataInterface {
  title: string;
  artist: string;
  image_url: string;
  is_playing: boolean;
  id: string;
  like: number;
  dislike: number;
}

export interface currentSongVoteInterface {
  active_song_id: string;
  like: number;
  dislike: number;
}

export interface suggestedSongsInterface {
  id: number;
  likes: number;
  room_key: string;
  suggested_song_title: string;
  suggested_songs_id: string;
  suggested_songs_img: string;
  suggested_by: string;
}

export default function PartyRoom() {
  const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [spotifyAuthenticated, setSpotifyAuthenticated] =
    useState<boolean>(false);
  const [currentSongData, setCurrentSongData] =
    useState<currentSongDataInterface | null>(null);
  const [currentSongVote, setCurrentSongVote] =
    useState<currentSongVoteInterface | null>(null);
  const [suggestedSongs, setSuggestedSongs] = useState<
    suggestedSongsInterface[] | null
  >(null);
  const [roomSongsQueue, setRoomSongsQueue] = useState<
    roomSongsQueueInterface[] | null
  >(null);
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);
  const [animationEventTypeObject, setAnimationEventTypeObject] = useState<
    Partial<LiveAnimationsProps>
  >({
    animationType: "like",
    withText: false,
    text: "",
  });

  const navigate = useNavigate();

  const returnToHomePage = () => {
    navigate(`/`);
  };
  const { roomCode } = useParams();
  const eventType = {
    VotesModel: "VotesModel",
    UserVotesModel: "UserVotesModel",
    SuggestedSongsVotesModal: "SuggestedSongsVotesModal",
    suggestedSongsModel: "suggestedSongsModel",
    SongsQueueModel: "SongsQueueModel",
  };

  const listenForSpotifySDK = (spotifyAccessToken: string) => {
    // Load the Spotify SDK script
    console.log("sdk did run ");

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    let player: Spotify.Player;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = spotifyAccessToken;
      console.log("thus ");
      console.log("token", token);

      player = new Spotify.Player({
        name: "Your Web Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      // Connect to the player
      player.connect();

      // Listen for player state changes
      player.addListener("player_state_changed", (state) => {
        if (!state) {
          console.error(
            "User is not playing music through the Web Playback SDK"
          );
          return;
        }

        if (state) {
          const { position, track_window } = state;
          const currentTrack = track_window.current_track;

          console.log("Song changed:", currentTrack.name);
        }
      });
      player.on("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });
      player.on("authentication_error", ({ message }) => {
        console.error("Failed to authenticate", message);
      });
      player.on("account_error", ({ message }) => {
        console.error("Failed to validate Spotify account", message);
      });
      player.on("playback_error", ({ message }) => {
        console.error("Failed to perform playback", message);
      });
    };
  };

  useEffect(() => {
    const run = async () => {
      // check that the room exist and the user is connected to that room
      if (typeof roomCode !== "string") {
        return returnToHomePage();
      }
      const roomData = await checkRoomIsExist({ room_key: roomCode });
      if (!roomData) {
        returnToHomePage();
      }
      const userData = await getUser();
      if (userData.room !== roomData.code) {
        returnToHomePage();
      } else {
        //check that the user is the host - so it will connect him to spotify
        if (roomData.host == userData.username) {
          await authenticateSpotify({
            spotifyAuthenticatedStateSetter: setSpotifyAuthenticated,
          });
        }
      }
      const data = await getCurrentSong();
      setCurrentSongData(data);

      setUserInfo(userData);
      // console.log("user data ", userData);

      if (userData?.host == true) {
        await getSpotifyAccessToken();
      }
      const suggestedSongsData = await getSuggestedSongs();
      // console.log("suggestedSongsData.data.data", suggestedSongsData);

      setSuggestedSongs(suggestedSongsData.data.data);

      const roomSongsQueue = await getRoomSongsQueue();
      // console.log("roomSongsQueue", roomSongsQueue);

      setRoomSongsQueue(roomSongsQueue.data);
    };
    const spotifyAccessTokenCookie = getCookie("spotify_access_token");
    run();
    if (spotifyAccessTokenCookie) {
      listenForSpotifySDK(spotifyAccessTokenCookie);
    }

    return () => {};
    //! continuew
    // implemnt the animations
    // implemt that when song change it notidift the server
  }, []);

  //useEffect for socket
  useEffect(() => {
    // Create a new WebSocket instance
    const socket = new WebSocket(`ws://localhost:8000/ws/updates/${roomCode}/`);

    // Handle connection open
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    // Handle received messages from the server
    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      // Parse the data if necessary

      const info = JSON.parse(event.data);
      const messageType = JSON.parse(event.data).event_type;

      if (messageType == "VotesModel") {
        const data = info.data.VotesModel;
        console.log("Data", typeof data, data);
        setCurrentSongVote({
          active_song_id: data.active_song_id,
          like: data.like,
          dislike: data.dislike,
        });
      } else if (messageType == "UserVotesModel") {
        const data = info.data.UserVotesModel;
        setAnimationEventTypeObject({
          animationType: data?.vote_type == "1" ? "like" : "dislike",
          withText: true,
          text: "",
        });
        setPlayAnimation(true);
      } else if (messageType == "SuggestedSongsVotesModal") {
        setPlayAnimation(true);

        const data = info.data.SuggestedSongsVotesModal;
        console.log("datat", data);

        setAnimationEventTypeObject({
          animationType: "like",
          withText: true,
          text: ``,
        });
        setPlayAnimation(true);
        return;

        //! continuew
        // implemnt the animations
      } else if (messageType == "suggestedSongsModel") {
        const data = info.data.suggestedSongsModel;
        console.log("suggestedSongsModel", data?.the_new_instance);
        if (
          suggestedSongs?.length &&
          suggestedSongs.filter(
            (i) =>
              i.suggested_songs_id == data?.the_new_instance?.suggested_songs_id
          )[0] == undefined
        ) {
          setAnimationEventTypeObject({
            animationType: "text",
            withText: true,
            text: `suggested ${data?.the_new_instance?.suggested_song_title}`,
          });
          setPlayAnimation(true);
        }
        setSuggestedSongs(
          data.all_data.map((i: suggestedSongsInterface) => {
            return {
              id: i.id,
              likes: i.likes,
              room_key: i.room_key,
              suggested_song_title: i.suggested_song_title,
              suggested_songs_id: i.suggested_songs_id,
              suggested_songs_img: i.suggested_songs_img,
              suggested_by: i.suggested_by,
            };
          })
        );
        return;
      } else if (messageType == "SongsQueueModel") {
        const data = info.data.SongsQueueModel;
        console.log("Data", typeof data, data);
        setRoomSongsQueue(
          data.SongsQueueModel.map((i: roomSongsQueueInterface) => {
            return {
              id: i.id,
              room_key: i.room_key,
              songs_id: i.songs_id,
              song_title: i.song_title,
              songs_img: i.songs_img,
            };
          })
        );
      }
    };

    // Handle errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Handle connection close
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up when the component unmounts
    return () => {
      socket.close();

      // Cleanup function to disconnect the player
      // if (player) {
      //   player.disconnect();
      //   console.log("Disconnected Spotify Player");
      // }
    };
  }, []);
  return (
    <Box sx={{ padding: 2, backgroundColor: "#f0f4ff", minHeight: "100vh" }}>
      <Grid container spacing={2}>
        <Grid position={"relative"}>
          <CurrentSongBox
            room_key={roomCode ? roomCode : "0"}
            currentSongData={
              currentSongData
                ? currentSongData
                : {
                    title: "",
                    artist: "",
                    image_url: "",
                    is_playing: false,
                    id: "",
                    like: 0,
                    dislike: 0,
                  }
            }
            currentSongVotes={currentSongVote}
          />
          <LiveAnimations
            userName={userInfo?.username}
            animationType={animationEventTypeObject.animationType || "like"}
            withText={animationEventTypeObject.withText}
            text={animationEventTypeObject.text}
            startAnimation={playAnimation}
            setAnimation={setPlayAnimation}
          />
        </Grid>
        <SuggestedSongsBox
          room_key={roomCode ? roomCode : ""}
          songs={suggestedSongs}
        />
        {/* Songs Queue Section */}
        <SongsQueue
          queue={
            roomSongsQueue
              ? roomSongsQueue
              : [
                  {
                    id: 0,
                    room_key: "",
                    songs_id: "",
                    song_title: "",
                    songs_img: "",
                  },
                ]
          }
        />
        <SuggestSongBox room_key={roomCode as string} />
        {/* Suggest Song Section */}
        {/* Connect with Spotify Section */}
        {/* <ConnectToSpotifybox /> */}
      </Grid>
    </Box>
  );
}
