

require('dotenv').config()


const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/services/ai.service");
const app = require('./src/app');

const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// 🚨 per-socket history (not global)
let latestMessageId = {}; // track latest per socket

io.on("connection", (socket) => {
  console.log("A user connected");

  let chatHistory = [];

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    chatHistory = [];
    delete latestMessageId[socket.id];
  });

  socket.on("ai-message", async (data) => {
    console.log("ai message received:", data);

    // assign unique id to this request
    const requestId = Date.now() + Math.random();
    latestMessageId[socket.id] = requestId;

    chatHistory.push({
      role: "user",
      parts: [{ text: data }],
    });

    const AIresponse = await generateResponse(chatHistory);

    // ❌ if not latest, ignore this response
    if (latestMessageId[socket.id] !== requestId) return;

    chatHistory.push({
      role: "model",
      parts: [{ text: AIresponse }],
    });

    console.log("AI Response:", AIresponse);
    socket.emit("ai-ke-message-ka-response", AIresponse);
  });

  socket.on("reset-chat", () => {
    chatHistory = [];
  });
});


const PORT = process.env.PORT

httpServer.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
