import { useState } from "react";
import { BrainCircuit, Send, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
}

const AiHealthChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      type: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ia/conseils-sante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.content }),
      });
      const data = await res.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer || "Aucune réponse générée.",
        type: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Erreur lors de la communication avec l'IA.",
          type: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center mb-8 space-x-4">
          <BrainCircuit className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Assistant Santé IA
          </h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">
              👋 Bonjour ! Je suis votre assistant santé virtuel. Je peux vous
              aider à comprendre des termes médicaux et fournir des informations
              générales sur la santé. Veuillez noter que je ne remplace pas
              l'avis d'un professionnel de santé.
            </p>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="h-[500px] overflow-y-auto p-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-start space-x-4 mb-6 ${
                      message.type === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 rounded-full p-2 ${
                        message.type === "user"
                          ? "bg-primary-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="w-6 h-6 text-primary-600" />
                      ) : (
                        <Bot className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div
                      className={`flex-1 ${
                        message.type === "user" ? "text-right" : ""
                      }`}
                    >
                      <div
                        className={`inline-block rounded-lg px-4 py-2 ${
                          message.type === "user"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start mb-6 space-x-4"
                  >
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full">
                      <Bot className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                          }}
                          className="flex space-x-1"
                        >
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 text-white transition-colors duration-200 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiHealthChat;
