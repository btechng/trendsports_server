import { Server } from "socket.io";
import http from "http";
export function setupSockets(server: http.Server) {
  const io = new Server(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("🔌 client connected", socket.id);
  });
  return io;
}
