import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  addMessage,
  createConversation,
  getConversationById,
  getConversationMessages,
} from "./db.js";
import { generateReply, HistoryMessage } from "./llm.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT ?? 4000);
const MAX_MESSAGE_LENGTH = 1200;

app.get("/chat/session/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required." });
  }

  const conversation = getConversationById(sessionId);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found." });
  }

  const messages = getConversationMessages(sessionId);
  return res.json({ sessionId, messages });
});

app.post("/chat/message", async (req, res) => {
  const { message, sessionId } = req.body as { message?: string; sessionId?: string };
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required and cannot be empty." });
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return res.status(413).json({
      error: `Message is too long. Please keep messages under ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  let conversationId = typeof sessionId === "string" && sessionId ? sessionId : undefined;
  if (conversationId && !getConversationById(conversationId)) {
    conversationId = undefined;
  }
  if (!conversationId) {
    conversationId = createConversation();
  }

  addMessage(conversationId, "user", trimmedMessage);

  const existingMessages = getConversationMessages(conversationId);
  const history: HistoryMessage[] = existingMessages.map((messageRecord) => ({
    role: messageRecord.sender === "user" ? "user" : "assistant",
    content: messageRecord.text,
  }));

  try {
    const reply = await generateReply(history);
    addMessage(conversationId, "ai", reply);
    return res.json({ reply, sessionId: conversationId });
  } catch (error) {
    console.error("LLM error:", error);
    return res.status(502).json({
      error:
        "Sorry, I couldn't generate a reply right now. Please try again in a moment.",
    });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Spur Live Chat backend is running." });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
