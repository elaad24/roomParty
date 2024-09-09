import React, { useEffect, useState } from "react";
import { checkUserInRoom, getUser } from "../api/userRequsets";
import { useNavigate, useParams } from "react-router-dom";
import { checkRoomIsExist, RoomResponse } from "../api/roomRequsets";

export default function PartyRoom() {
  const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);
  const [userInfo, setUserInfo] = useState<RoomResponse | null>(null);

  const navigate = useNavigate();

  //check the room exist
  // check the user in that room

  const returnToHomePage = () => {
    navigate(`/}`);
  };
  const { roomCode } = useParams();

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
      setRoomInfo(roomData);

      const userData = await getUser();
      if (userData.room !== roomData.code) {
        returnToHomePage();
      }
      setUserInfo(userData);
    };
    run();
  }, []);

  return (
    <>
      <div>PartyRoom</div>
      <div>PartyRoom</div>
      <div>PartyRoom</div>
      <div>PartyRoom</div>
      <div>PartyRoom</div>
      <div style={{ color: "teal" }}>PartyRoom</div>
      <div>PartyRoom</div>
    </>
  );
}
