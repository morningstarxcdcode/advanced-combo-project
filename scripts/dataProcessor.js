const { io } = require("socket.io-client");

const WS_URL = "http://localhost:4000";

function startDataProcessing() {
  const socket = io(WS_URL);

  socket.on("connect", () => {
    console.log("Connected to backend Socket.io server");

    // Simulate sending data every 5 seconds
    setInterval(() => {
      const data = {
        timestamp: new Date(),
        value: Math.random() * 100,
      };
      socket.emit("message", JSON.stringify(data));
      console.log("Sent data:", data);
    }, 5000);
  });

  socket.on("message", (message) => {
    console.log("Received from server:", message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.io server");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.io connection error:", error);
  });
}

startDataProcessing();
