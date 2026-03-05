import ChatBox from "../components/ChatBox";

function Chat() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-2">
          AI Gift Assistant 🤖
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Batao kiske liye gift chahiye — Gemini suggest karega! ✨
        </p>
      </div>
      <ChatBox />
    </div>
  );
}

export default Chat;