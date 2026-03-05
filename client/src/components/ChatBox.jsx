import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "/api";

function ChatBox() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "Heyy! 🎁 Main Giftbow ka AI assistant hoon. Batao kiske liye gift dhundh rahe ho?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

   try {
      const { data } = await axios.post(
        `${API}/chat`,
        { message: input },
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Oops! Kuch error aa gaya. Dobara try karo! 😅" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-150 bg-white dark:bg-[#242424] rounded-2xl border border-[#F26076]/10 dark:border-white/5 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#F26076]/10 dark:border-white/5 bg-[#F26076]/5">
        <h2 className="font-display font-bold text-gray-800 dark:text-white">
          🎁 AI Gift Assistant
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Powered by Groq • Hinglish mein baat karo!
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#F26076] text-white rounded-br-sm"
                  : "bg-[#F26076]/10 dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#F26076]/10 dark:bg-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#F26076] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#F26076] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#F26076] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#F26076]/10 dark:border-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Kiske liye gift chahiye? Budget batao..."
          className="flex-1 bg-[#F26076]/5 dark:bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none border border-[#F26076]/20 dark:border-white/10 focus:border-[#F26076] transition-colors dark:text-white placeholder:text-gray-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-full bg-[#F26076] text-white flex items-center justify-center hover:bg-[#e04f65] transition-colors disabled:opacity-50"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatBox;