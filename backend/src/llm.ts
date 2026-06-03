import { OpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const systemPrompt = `You are a helpful support agent for a small e-commerce store called Spur Shop.
The store ships within 3-5 business days, offers a 30-day return policy on unworn items, and provides support Monday through Friday, 9am-6pm.
Answer clearly and concisely in the voice of a friendly customer support representative. If the user asks about something outside the store policies, say you don't have that information and direct them to contact support.`;

export type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
}

function generateLocalReply(history: HistoryMessage[]): string {
  const lastMessage = history[history.length - 1]?.content.toLowerCase() ?? "";
  if (/\b(shipping|ship|delivery|deliver)\b/.test(lastMessage)) {
    return "Our orders normally ship within 3-5 business days. If you need a faster option, our support team can help with expedited shipping.";
  }
  if (/\b(return|refund|exchange|return policy)\b/.test(lastMessage)) {
    return "We offer a 30-day return policy on unworn items. Please keep your order number handy and visit our support page to start a return.";
  }
  if (/\b(order|status|tracking|tracking number)\b/.test(lastMessage)) {
    return "For order status, please provide your order number or contact support for a tracking update.";
  }
  if (/\b(hours|open|close|business|support)\b/.test(lastMessage)) {
    return "Our support team is available Monday through Friday, 9am-6pm. If you message outside those hours, we'll get back to you on the next business day.";
  }
  return "I’m running in fallback mode because OPENAI_API_KEY is not configured. Please set the key in backend/.env to enable full AI replies.";
}

export async function generateReply(history: HistoryMessage[]): Promise<string> {
  const client = getClient();
  if (!client) {
    console.warn("OPENAI_API_KEY not found. Using local fallback responses.");
    return generateLocalReply(history);
  }

  const conversationMessages: ChatCompletionMessageParam[] = history
    .slice(-8)
    .map((item) => ({
      role: item.role as "user" | "assistant",
      content: item.content,
    }));

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...conversationMessages,
  ];

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    max_tokens: 250,
    temperature: 0.5,
  });

  const reply = response.choices?.[0]?.message?.content?.trim();
  return reply || "Sorry, I couldn't generate a reply at this time.";
}
