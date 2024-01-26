import { Server } from "socket.io";
let userCount = 0;
export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    userCount++;
    io.emit("userCount", userCount); // Emit user count to all clients

    socket.on("disconnect", () => {
      userCount--;
      io.emit("userCount", userCount); // Update user count on disconnection
    });
    socket.on("send-message", (obj) => {
      io.emit("receive-message", obj);
    });
  });

  console.log("Setting up socket");
  res.end();
}
