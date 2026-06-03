import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
  createdAt: string;
};

type ServerMessage = {
  reply?: string;
  sessionId?: string;
  messages?: ChatMessage[];
  error?: string;
};

const STORAGE_KEY = "spur-live-chat-session";
const MAX_MESSAGE_LENGTH = 1200;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const trimmedInput = inputValue.trim();
  const isSendDisabled = isSending || trimmedInput.length === 0;

  useEffect(() => {
    const storedSessionId = localStorage.getItem(STORAGE_KEY);
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadHistory(storedSessionId);
    } else {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const sessionMessage = useMemo(() => {
    if (!sessionId) {
      return "New chat session. Start by asking a question about shipping, returns, or orders.";
    }
    return "Continuing your existing chat session.";
  }, [sessionId]);

  async function loadHistory(sessionId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}`);
      if (!response.ok) {
        localStorage.removeItem(STORAGE_KEY);
        setSessionId(null);
        return;
      }
      const body = (await response.json()) as ServerMessage;
      if (body.messages) {
        setMessages(body.messages);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load previous chat history. Try refreshing the page.");
    } finally {
      setHasLoaded(true);
    }
  }

  async function handleSend() {
    if (isSendDisabled) {
      return;
    }

    if (trimmedInput.length > MAX_MESSAGE_LENGTH) {
      setError(`Message must be under ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmedInput,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setInputValue("");
    setError(null);
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput, sessionId }),
      });

      const body = (await response.json()) as ServerMessage;
      if (!response.ok || body.error) {
        const message = body.error ?? "Unable to send your message. Please try again.";
        setError(message);
        return;
      }

      if (body.reply) {
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: body.reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((current) => [...current, aiMessage]);
      }

      if (body.sessionId) {
        setSessionId(body.sessionId);
        localStorage.setItem(STORAGE_KEY, body.sessionId);
      }
    } catch (err) {
      console.error(err);
      setError("Network error: failed to reach the backend. Try again in a moment.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="chat-card">
        <header className="chat-header">
          <div>
            <h1>Spur Shop Support</h1>
            <p>{sessionMessage}</p>
          </div>
        </header>

        <section className="message-list" aria-live="polite">
          {messages.length === 0 && hasLoaded ? (
            <div className="empty-state">Ask a question about shipping, returns, or orders to begin.</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message-row ${message.sender === "ai" ? "ai-message" : "user-message"}`}
              >
                <div className="message-bubble">
                  <span>{message.text}</span>
                </div>
              </div>
            ))
          )}
          {isSending && (
            <div className="message-row ai-message">
              <div className="message-bubble typing">Agent is typing…</div>
            </div>
          )}
          <div ref={endRef} />
        </section>

        <footer className="chat-controls">
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <textarea
            id="chat-input"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your question here..."
            rows={3}
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={isSending}
          />
          <div className="controls-row">
            <span className="char-counter">{trimmedInput.length}/{MAX_MESSAGE_LENGTH}</span>
            <button onClick={handleSend} disabled={isSendDisabled}>
              Send
            </button>
          </div>
          {error && <div className="error-box">{error}</div>}
        </footer>
      </div>
    </div>
  );
}

export default App;
