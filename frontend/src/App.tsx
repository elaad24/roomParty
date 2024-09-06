import { Route, Routes } from "react-router-dom";
import "./App.css";
import CreateRoomPage from "./pages/CreateRoomPage";
import HomePage from "./pages/HomePage";
import RoomJoinPage from "./pages/RoomJoinPage";
import Room from "./components/Room";

function App() {
  return (
    <Routes>
      <Route path="/createRoom" element={<CreateRoomPage />} />
      <Route path="/joinRoom" element={<RoomJoinPage />} />
      <Route path="/room/:roomCode" element={<Room />} />
      <Route path="/room/:roomCode" element={<Room />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
