import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8003";

function ChatWidget() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your HiLCoE Student Assistant. How can I support you today?",
    },
  ]);

  const sessionId = useMemo(() => {
    const randomPart = Math.random().toString(36).slice(2, 10);
    return `web-${Date.now()}-${randomPart}`;
  }, []);

  const listRef = useRef(null);

  const quickPrompts = [
    "What are the admission requirements for software engineering?",
    "Show me student services and support centers.",
    "How do I register for courses this semester?",
    "What scholarships are available at HiLCoE?",
  ];

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isLoading]);

  const sendMessage = async (forcedText) => {
    const text = (forcedText ?? input).trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Assistant service unavailable.");
      }

      const data = await response.json();
      const reply = data.reply || "I am here to help with HiLCoE student information.";

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I could not reach the assistant service right now. Please try again shortly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.35rem] bg-white">
      <header className="border-b border-hilcoe-blue/10 bg-hilcoe-blue px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">HiLCoE AI Assistant</p>
            <h2 className="mt-1 text-lg font-black text-white sm:text-xl">Student Support Chat</h2>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
            Session Active
          </span>
        </div>
      </header>

      <div className="border-b border-hilcoe-blue/5 bg-hilcoe-gray px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="rounded-full border border-hilcoe-blue/10 bg-white px-3 py-1.5 text-[11px] font-bold text-hilcoe-blue shadow-sm transition hover:border-hilcoe-blue/30 hover:bg-hilcoe-blue/5"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div ref={listRef} className="chat-scroll flex-1 space-y-5 overflow-y-auto bg-white px-4 py-6 sm:px-8 sm:py-8">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={`${message.sender}-${index}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-lg shadow-hilcoe-blue/5 sm:max-w-[78%] sm:text-[15px] ${
                  message.sender === "user"
                    ? "rounded-tr-md bg-hilcoe-blue text-white"
                    : "rounded-tl-md bg-hilcoe-gray text-hilcoe-blue font-medium"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-md bg-hilcoe-gray px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-hilcoe-blue [animation-delay:-0.25s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-hilcoe-blue [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-hilcoe-blue" />
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-hilcoe-blue/5 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-end gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message HiLCoE Student Assistant..."
            className="max-h-40 min-h-[52px] flex-1 resize-none rounded-2xl border-2 border-hilcoe-blue/5 bg-hilcoe-gray px-4 py-3 text-sm text-hilcoe-blue placeholder:text-hilcoe-blue/40 font-medium focus:border-hilcoe-blue/20 focus:outline-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading}
            className="h-[52px] rounded-2xl bg-hilcoe-red px-8 text-sm font-black text-white shadow-lg shadow-hilcoe-red/20 transition hover:scale-[1.02] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 uppercase tracking-wider"
          >
            Send
          </button>
        </div>
      </footer>
    </section>
  );
}

export default ChatWidget;
