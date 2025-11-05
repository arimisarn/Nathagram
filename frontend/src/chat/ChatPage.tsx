// chat/ChatPage.tsx
import React, { useState } from "react";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [currentUsername, setCurrentUsername] = useState<string>(
    localStorage.getItem("username") || ""
  ); // ou récupère depuis Redux/auth

  return (
    <div className="flex h-[90vh] bg-gray-50">
      {/* Liste des conversations + recherche utilisateurs */}
      <ConversationsList
        onSelect={(id: number) => setSelectedConversationId(id)}
      />

      {/* Fenêtre de chat */}
      {selectedConversationId ? (
        <ChatWindow
          conversationId={selectedConversationId}
          currentUsername={currentUsername}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Sélectionnez une conversation
        </div>
      )}
    </div>
  );
}
