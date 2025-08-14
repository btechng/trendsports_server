import { Server } from "socket.io";
export function setupSockets(server) {
    const io = new Server(server, { cors: { origin: "*" } });
    io.on("connection", (socket) => {
        console.log("🔌 client connected", socket.id);
    });
    return io;
}
