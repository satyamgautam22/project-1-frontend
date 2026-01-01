import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false
});

export const connectSocket = (token) => {
  if (!token) return;
  socket.auth = { token };
  socket.connect();
};

export const getSocket = () => socket;

// ✅ ADD THIS LINE
export default socket;
