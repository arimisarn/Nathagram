import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bot } from "lucide-react";

interface User {
  id: number;
  username: string;
  profile_photo?: string;
}

interface Message {
  id: number;
  sender: User;
  text: string | null;
  image_url: string | null;
  created_at: string;
}

interface Conversation {
  id: number;
  participants: User[];
  messages: Message[];
}

interface Props {
  conversationId: number;
  currentUsername: string;
  conversationData?: Conversation;
}

export default function ChatWindow({
  conversationId,
  currentUsername,
  conversationData,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(
    conversationData || null
  );
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState<string>(currentUsername || "");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Détection IA
  const isAIConversation = conversationId === -1;
  const NATHA_AI: User = {
    id: -1,
    username: "Natha IA",
    profile_photo: "",
  };

  const defaultAvatar =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yMCAxMkMyMi4yMSAxMiAyNCAxMy43OSAyNCAxNkMyNCAxOC4yMSAyMi4yMSAyMCAyMCAyMEMxNy43OSAyMCAxNiAxOC4yMSAxNiAxNkMxNiAxMy43OSAxNy43OSAxMiAyMCAxMlpNMjAgMjJDMjQuNDIgMjIgMjggMjMuNTggMjggMjVWMjhIMTJWMjVDMTIgMjMuNTggMTUuNTggMjIgMjAgMjJaIiBmaWxsPSIjNjM2NkYxIi8+PC9zdmc+";

  // --- 🔑 Variable d'environnement pour GROQ API ---
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

  // --- Utilisateur courant ---
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!currentUsername || currentUsername.trim() === "") {
        try {
          const res = await axios.get("http://localhost:8000/auth/user/", {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          });
          setCurrentUser(res.data.username || res.data.user?.username || "");
        } catch (err) {
          console.error("Erreur récupération utilisateur:", err);
        }
      } else {
        setCurrentUser(currentUsername);
      }
    };
    getCurrentUser();
  }, [currentUsername]);

  // --- Messages ---
  useEffect(() => {
    if (isAIConversation) {
      setMessages([]);
      return;
    }

    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/chat/conversations/${conversationId}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setConversation(res.data);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Erreur fetch messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [conversationId]);

  // --- Scroll automatique ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const getUserPhoto = (user: User) => {
    if (!user.profile_photo || user.profile_photo.trim() === "")
      return defaultAvatar;
    return user.profile_photo.startsWith("/")
      ? `http://localhost:8000${user.profile_photo}`
      : user.profile_photo;
  };

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const otherParticipant = isAIConversation
    ? NATHA_AI
    : conversation?.participants.find((p) => p.username !== currentUser);

  // --- Envoi de message ---
  const sendMessage = async () => {
    if (!text.trim()) return;

    if (isAIConversation) {
      // Message utilisateur
      const userMessage: Message = {
        id: Date.now(),
        sender: { id: 0, username: currentUser, profile_photo: "" },
        text,
        image_url: null,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setText("");
      scrollToBottom();

      try {
        const res = await axios.post(
          GROQ_API_URL,
          {
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content:
                  "Tu es une IA bienveillante nommée **Natha IA**, toujours polie, empathique et utile.",
              },
              {
                role: "user",
                content: userMessage.text,
              },
            ],
            max_tokens: 200,
          },
          {
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`, // ✅ Variable d’environnement utilisée ici
              "Content-Type": "application/json",
            },
          }
        );

        const aiText =
          res.data?.choices?.[0]?.message?.content ||
          "Je n'ai pas de réponse pour le moment.";

        const aiMessage: Message = {
          id: Date.now() + 1,
          sender: NATHA_AI,
          text: aiText,
          image_url: null,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        scrollToBottom();
      } catch (err) {
        console.error("Erreur API GROQ:", err);
      }

      return;
    }

    // --- Message normal ---
    try {
      const res = await axios.post(
        `http://localhost:8000/chat/conversations/${conversationId}/send_message_to_user/`,
        { text },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      const newMessage = res.data;
      const messageToAdd: Message = {
        ...newMessage,
        sender: {
          ...newMessage.sender,
          username: newMessage.sender?.username || currentUser,
        },
      };

      setMessages((prev) => [...prev, messageToAdd]);
      setText("");
      scrollToBottom();
    } catch (err) {
      console.error("Erreur envoi message:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* --- Header --- */}
      {otherParticipant && (
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center shadow-sm">
          {otherParticipant.id === -1 ? (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white">
              <Bot size={28} />
            </div>
          ) : (
            <img
              src={getUserPhoto(otherParticipant)}
              alt={otherParticipant.username}
              className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-blue-100"
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
              }}
            />
          )}
          <div className="flex-1 ml-4">
            <h3 className="font-semibold text-gray-900 text-lg">
              {otherParticipant.username}
            </h3>
          </div>
        </div>
      )}

      {/* --- Zone messages --- */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.map((msg, index) => {
            const isMine = msg.sender.username === currentUser;
            const showAvatar =
              !isMine &&
              (index === 0 ||
                messages[index - 1]?.sender?.username !== msg.sender?.username);
            const isLastInGroup =
              index === messages.length - 1 ||
              messages[index + 1]?.sender?.username !== msg.sender?.username;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"
                  }`}
              >
                {!isMine && (
                  <div className="w-8 h-8 flex-shrink-0">
                    {showAvatar &&
                      (msg.sender.id === -1 ? (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white">
                          <Bot size={18} />
                        </div>
                      ) : (
                        <img
                          src={getUserPhoto(msg.sender)}
                          alt={msg.sender.username}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = defaultAvatar;
                          }}
                        />
                      ))}
                  </div>
                )}
                <div
                  className={`group max-w-xs sm:max-w-md lg:max-w-lg flex flex-col ${isMine ? "items-end" : "items-start"
                    }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm relative ${isMine
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-gray-200 text-gray-900 rounded-bl-md"
                      } ${msg.text ? "" : "p-1"}`}
                  >
                    {msg.text && (
                      <p className="text-sm leading-relaxed break-words">
                        {msg.text}
                      </p>
                    )}
                    {msg.image_url && (
                      <div className={msg.text ? "mt-2" : ""}>
                        <img
                          src={msg.image_url}
                          className="max-w-full rounded-xl shadow-sm"
                          alt="Image partagée"
                        />
                      </div>
                    )}
                  </div>
                  {isLastInGroup && (
                    <div
                      className={`text-xs text-gray-500 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isMine ? "text-right" : "text-left"
                        }`}
                    >
                      {formatTime(msg.created_at)}
                    </div>
                  )}
                </div>
                {isMine && <div className="w-8 h-8 flex-shrink-0"></div>}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --- Input --- */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full bg-gray-100 border-0 rounded-full px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-500"
                placeholder={
                  otherParticipant
                    ? `Message à ${otherParticipant.username}...`
                    : "Tapez votre message..."
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              {text.trim() && (
                <button
                  onClick={sendMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
