// chat/ConversationsList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bot } from "lucide-react"; // <-- Icône Lucide pour IA

interface User {
  id: number;
  username: string;
  nom_utilisateur?: string; // Compatibilité ancienne version
  profile_photo?: string | null;
  is_ai?: boolean; // Identifier l'IA
}

interface Conversation {
  id: number;
  participants: User[];
  created_at: string;
  is_ai_conversation?: boolean; // Conversations IA
}

interface Props {
  onSelect: (id: number) => void;
}

const DEFAULT_AVATAR = "http://localhost:8000/media/users/default.png";

// IA par défaut
const NATHA_AI: User = {
  id: -1,
  username: "Natha IA",
  is_ai: true,
};

const AI_CONVERSATION: Conversation = {
  id: -1,
  participants: [NATHA_AI],
  created_at: new Date().toISOString(),
  is_ai_conversation: true,
};
function ConversationsList({ onSelect }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string>(
    localStorage.getItem("current_username") || ""
  );

  const token = localStorage.getItem("token");

  // Récupérer l'utilisateur courant
  const fetchCurrentUser = async () => {
    if (currentUser) return;
    try {
      const res = await axios.get("http://localhost:8000/api/profile/", {
        headers: { Authorization: `Token ${token}` },
      });
      const username = res.data.username || res.data.nom_utilisateur || "";
      setCurrentUser(username);
      localStorage.setItem("current_username", username);
    } catch {
      try {
        const res = await axios.get("http://localhost:8000/auth/me/", {
          headers: { Authorization: `Token ${token}` },
        });
        const username = res.data.username || res.data.nom_utilisateur || "";
        setCurrentUser(username);
        localStorage.setItem("current_username", username);
      } catch {
        const savedUser = localStorage.getItem("current_username");
        if (!savedUser) {
          const username = prompt(
            "Veuillez entrer votre nom d'utilisateur (arimisa ou nathalie):"
          );
          if (username) {
            setCurrentUser(username);
            localStorage.setItem("current_username", username);
          }
        }
      }
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await axios.get("http://localhost:8000/chat/conversations/", {
        headers: { Authorization: `Token ${token}` },
      });
      const conversationsWithAI = [AI_CONVERSATION, ...(res.data || [])];
      setConversations(conversationsWithAI);
    } catch {
      setConversations([AI_CONVERSATION]);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversations.length > 0 && !currentUser) {
      fetchCurrentUser();
    }
  }, [conversations]);

  const searchUser = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const aiResults: User[] = [];
    if (NATHA_AI.username.toLowerCase().includes(query.toLowerCase())) {
      aiResults.push(NATHA_AI);
    }

    try {
      const res = await axios.get(
        `http://localhost:8000/chat/search_user/?q=${query}`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setSearchResults([...aiResults, ...(res.data.users || [])]);
    } catch {
      setSearchResults(aiResults);
    }
  };

  const startConversation = async (recipientId: number) => {
    if (recipientId === -1) {
      setSearchQuery("");
      setSearchResults([]);
      onSelect(-1);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/chat/start_conversation/",
        { recipient_id: recipientId, text: "" },
        { headers: { Authorization: `Token ${token}` } }
      );
      fetchConversations();
      setSearchQuery("");
      setSearchResults([]);
      onSelect(res.data.conversation_id);
    } catch (err) {
      console.error(err);
    }
  };

  const getUserName = (user: User | null) => {
    if (!user) return "Utilisateur inconnu";
    return user.username || user.nom_utilisateur || "Utilisateur inconnu";
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (conversation.is_ai_conversation) return NATHA_AI;
    if (!conversation.participants || conversation.participants.length === 0)
      return null;
    if (!currentUser) return conversation.participants[0];

    const otherParticipants = conversation.participants.filter((p) => {
      const name = p.username || p.nom_utilisateur;
      return name !== currentUser;
    });
    return otherParticipants.length > 0
      ? otherParticipants[0]
      : conversation.participants[0];
  };

  const handleConversationSelect = (conversationId: number) => {
    onSelect(conversationId);
  };

  return (
    <div className="w-64 border-r p-4 bg-white overflow-auto">
      <h2 className="font-bold mb-4">Conversations</h2>

      {/* Recherche utilisateur */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => searchUser(e.target.value)}
        placeholder="Rechercher un utilisateur..."
        className="border rounded w-full px-2 py-1 mb-2"
      />

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <ul className="bg-white shadow rounded mb-4 text-black">
          {searchResults.map((user) => (
            <li
              key={user.id}
              onClick={() => startConversation(user.id)}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
            >
              {user.is_ai ? (
                <Bot className="w-8 h-8 text-blue-500" />
              ) : (
                <img
                  src={user.profile_photo || DEFAULT_AVATAR}
                  alt={getUserName(user)}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                />
              )}
              <div className="flex items-center gap-1">
                <span>{getUserName(user)}</span>
                {user.is_ai && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                    IA
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Liste des conversations */}
      <ul>
        {conversations.map((conv) => {
          const participant = getOtherParticipant(conv);
          const isAI = conv.is_ai_conversation;

          return (
            <li
              key={conv.id}
              onClick={() => handleConversationSelect(conv.id)}
              className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 ${
                isAI ? "border-l-2 border-blue-500" : ""
              }`}
            >
              {participant?.is_ai ? (
                <Bot className="w-8 h-8 text-blue-500" />
              ) : (
                <img
                  src={participant?.profile_photo || DEFAULT_AVATAR}
                  alt={getUserName(participant)}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                />
              )}
              <div className="flex items-center gap-1 flex-1">
                <span>{getUserName(participant)}</span>
                {isAI && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                    IA
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default ConversationsList;
