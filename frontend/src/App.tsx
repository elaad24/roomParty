import { Route, Routes } from "react-router-dom";
import "./App.css";
import CreateRoomPage from "./pages/CreateRoomPage";
import HomePage from "./pages/HomePage";
import RoomJoinPage from "./pages/RoomJoinPage";
import Room from "./components/Room";
import Signup from "./pages/Signup";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthContext";
import PartyRoom from "./pages/PartyRoom";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route element={<RequireAuth />}>
          <Route path="/createRoom" element={<CreateRoomPage />} />
          <Route path="/joinRoom" element={<RoomJoinPage />} />
          <Route path="/room/:roomCode" element={<Room />} />
          <Route path="/partyRoom/:roomCode" element={<PartyRoom />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
