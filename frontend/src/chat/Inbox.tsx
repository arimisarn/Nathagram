import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface User {
  id: string;
  username: string;
  profile_image?: string;
}
interface Conversation {
  id: string;
  participants: User[];
}

export default function Inbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/conversations/")
      .then((res) => setConversations(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Inbox</h2>
      {conversations.map((c) => {
        const other = c.participants.find(
          (u) => u.id !== localStorage.getItem("user_id")
        );
        if (!other) return null;
        return (
          <Link
            key={c.id}
            to={`/direct/${c.id}`}
            className="flex items-center p-2 hover:bg-gray-800 rounded"
          >
            <img
              src={other.profile_image || "/default.png"}
              className="w-10 h-10 rounded-full mr-3"
            />
            <p className="font-semibold">{other.username}</p>
          </Link>
        );
      })}
    </div>
  );
}
  