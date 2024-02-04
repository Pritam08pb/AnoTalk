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
    socket.on("send-personal", (objj) => {
      // Emit the personal message to the specified user identified by their ID
      const currentDate = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
      };
      let timeStamp = currentDate.toLocaleTimeString([], options);

      let object = { ...objj, timeStamp };
      io.to(objj.id).emit("receive-personal", object);
    });

    socket.on("delete-message", (deletedMessage) => {
      io.emit("message-deleted", deletedMessage);
    });
  });

  console.log("Setting up socket");
  res.end();
}
