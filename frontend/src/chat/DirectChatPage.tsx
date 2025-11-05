import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface User {
  id: string;
  username: string;
}
interface Message {
  id: string;
  text: string;
  sender: User;
  created_at: string;
}

export default function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const myId = localStorage.getItem("user_id");

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (!conversationId) return;
    axios
      .get(
        `http://localhost:8000/api/conversations/${conversationId}/messages/`
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }, [conversationId]);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!text || !conversationId) return;
    try {
      const res = await axios.post(
        `http://localhost:8000/api/conversations/${conversationId}/messages/`,
        { text }
      );
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erreur lors de l'envoi");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs md:max-w-md p-2 rounded-lg ${
              msg.sender.id === myId
                ? "bg-indigo-600 self-end"
                : "bg-gray-700 self-start"
            }`}
          >
            <strong>{msg.sender.username}</strong>: {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex p-4 border-t border-gray-700">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 p-2 rounded-lg bg-gray-800 text-white focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
