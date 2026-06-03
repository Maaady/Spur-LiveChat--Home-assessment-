import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "..", "chat.json");

export type MessageRecord = {
  id: string;
  conversationId: string;
  sender: "user" | "ai";
  text: string;
  createdAt: string;
};

export type ConversationRecord = {
  id: string;
  createdAt: string;
};

type Schema = {
  conversations: ConversationRecord[];
  messages: MessageRecord[];
};

const adapter = new JSONFile<Schema>(dbPath);
const db = new Low<Schema>(adapter, { conversations: [], messages: [] });

await db.read();
if (!db.data) {
  db.data = { conversations: [], messages: [] };
}

export function createConversation(): string {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  db.data!.conversations.push({ id, createdAt });
  void db.write();
  return id;
}

export function getConversationById(id: string): ConversationRecord | undefined {
  return db.data?.conversations.find((conversation) => conversation.id === id);
}

export function addMessage(conversationId: string, sender: "user" | "ai", text: string): MessageRecord {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const message: MessageRecord = { id, conversationId, sender, text, createdAt };
  db.data!.messages.push(message);
  void db.write();
  return message;
}

export function getConversationMessages(conversationId: string): MessageRecord[] {
  return db.data?.messages
    .filter((message) => message.conversationId === conversationId)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt)) ?? [];
}
