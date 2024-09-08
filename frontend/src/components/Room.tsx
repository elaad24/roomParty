import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface roomState {
  votesToSkip: number;
  guestCanPause: boolean;
  isHost: boolean;
}

export default function Room() {
  const [roomInfo, setRoomInfo] = useState<roomState>({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });
  const { roomCode } = useParams();

  useEffect(() => {
    const getRoomInfo = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/get-room?code=${roomCode}`
        );
        console.log(data);

        setRoomInfo({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      } catch (err) {
        console.log(err);
      }
    };

    getRoomInfo();
  }, []);
  return (
    <>
      <div>
        <h2>{roomCode}</h2>
        <p>votes:{roomInfo.votesToSkip}</p>
        <p>guest can puase:{String(roomInfo.guestCanPause)}</p>
        <p>host:{String(roomInfo.isHost)}</p>
      </div>
    </>
  );
}
