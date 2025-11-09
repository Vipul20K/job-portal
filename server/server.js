
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";

// Models
import { Message } from "./models/message.js";
import { Knowledge } from "./models/knowledge.js";

// Load server environment variables
dotenv.config({ path: "./.env" });

// ---------------- Cloudinary setup ----------------
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------- HTTP & Socket.io setup ----------------
const server = http.createServer(app);
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ---------------- Socket.io events ----------------
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_room", ({ room, userId, userName }) => {
    socket.join(room);
    socket.data = { userId, userName };
    console.log(`${userName} joined room: ${room}`);
    io.to(room).emit("user_joined", { userId, userName });
  });

  socket.on("send_message", async ({ room, text, senderId, senderName, createdAt }) => {
    console.log("Message received:", { room, text, senderId, senderName });

    // Build a message object that will be emitted immediately so clients
    // can render it, even if DB persistence fails.
    const now = createdAt || new Date().toISOString();
    const msgObj = { room, text, senderId, senderName, createdAt: now };

    // Try to persist to DB but don't let persistence errors block delivery.
    (async () => {
      try {
        const msgDoc = new Message(msgObj);
        await msgDoc.save();
      } catch (saveErr) {
        console.warn("Warning: failed to save user message to DB:", saveErr && saveErr.message ? saveErr.message : saveErr);
      }
    })();

    // Broadcast to others immediately (client already appends the sender message locally).
    socket.broadcast.to(room).emit("receive_message", msgObj);

  // CareerBot logic
  // Do not process messages that originate from the bot itself — this prevents the bot
  // replying to its own messages (or to greetings sent as bot messages).
  const fromBot = senderId === "bot" || (senderName && String(senderName).toLowerCase().includes("careerbot"));
  if (!fromBot && (room === "career-bot" || text.toLowerCase().startsWith("/bot"))) {
      try {
        const allFaqs = await Knowledge.find({});
        const query = text.toLowerCase();
        const matched = allFaqs.find((faq) =>
          faq.keywords.some((k) => query.includes(k.toLowerCase()))
        );

        let reply;

        if (matched) {
          reply = matched.answer;
          console.log("Matched FAQ:", matched.question);
        } else {
          // No matching FAQ found — emit a clear no-answer message from the bot
          console.log("No matching FAQ found in Knowledge DB for query:", query);
          reply = "I couldn't find an answer in the knowledge base. Try rephrasing or ask about another topic.";
        }

        const botMsgObj = {
          room,
          text: reply,
          senderId: "bot",
          senderName: "CareerBot",
          createdAt: new Date().toISOString(),
        };

        // Emit bot response immediately so clients see the answer even if DB is down.
        io.to(room).emit("receive_message", botMsgObj);

        // Persist bot message in background if possible.
        (async () => {
          try {
            const botDoc = new Message(botMsgObj);
            await botDoc.save();
          } catch (saveErr) {
            console.warn("Warning: failed to save bot message to DB:", saveErr && saveErr.message ? saveErr.message : saveErr);
          }
        })();
      } catch (err) {
        console.error("Bot error:", err);
        // If an unexpected error happens while retrieving or matching Knowledge entries,
        // emit a KB-unavailable message so clients receive a consistent bot response.
        const failMsg = {
          room,
          text: "Sorry — the knowledge base is currently unavailable. Please try again later.",
          senderId: "bot",
          senderName: "CareerBot",
          createdAt: new Date().toISOString(),
        };
        io.to(room).emit("receive_message", failMsg);
        (async () => {
          try {
            const botDoc = new Message(failMsg);
            await botDoc.save();
          } catch (saveErr) {
            console.warn("Warning: failed to save bot failure message to DB:", saveErr && saveErr.message ? saveErr.message : saveErr);
          }
        })();
      }
    }
  });

  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

// ---------------- Start server ----------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server & Socket.io running on port ${PORT}`);
});
