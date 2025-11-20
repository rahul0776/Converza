"use client";

import { useConversations } from "@/hooks/use-conversations";
import { useConversationStore } from "@/store/conversation-store";
import { MessageCircle, Users } from "lucide-react";
import { useSession } from "next-auth/react";

export function ConversationList() {
    const { data: conversations, isLoading } = useConversations();
    const { activeConversationId, setActiveConversation } = useConversationStore();
    const { data: session } = useSession();

    if (isLoading) {
        return (
            <div className="p-4 text-center text-[#6B6B6B]">
                <p className="text-sm">Loading conversations...</p>
            </div>
        );
    }

    if (!conversations || conversations.length === 0) {
        return (
            <div className="p-4 text-center text-[#6B6B6B]">
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat to get started!</p>
            </div>
        );
    }

    const getConversationName = (conv: typeof conversations[0]) => {
        if (conv.isGroup) {
            return conv.name || "Unnamed Group";
        }
        // For DMs, show the other participant's name
        const otherParticipant = conv.participants.find(p => p.id !== session?.user?.id);
        return otherParticipant?.name || otherParticipant?.email || "Unknown User";
    };

    const getConversationAvatar = (conv: typeof conversations[0]) => {
        if (conv.isGroup) {
            return <Users className="w-5 h-5" />;
        }
        const otherParticipant = conv.participants.find(p => p.id !== session?.user?.id);
        const initial = (otherParticipant?.name || otherParticipant?.email || "U").charAt(0).toUpperCase();
        return <span className="font-bold">{initial}</span>;
    };

    return (
        <div className="flex-1 overflow-y-auto p-3">
            <div className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3 px-3">
                Messages
            </div>
            {conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                const lastMessagePreview = conv.lastMessage?.content || "No messages yet";
                const lastMessageTime = conv.lastMessage
                    ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "";

                return (
                    <button
                        key={conv.id}
                        onClick={() => setActiveConversation(conv.id)}
                        className={`w-full p-4 rounded-xl mb-2 text-left transition-all hover:bg-[#FFF8F0] group ${isActive ? "bg-gradient-to-r from-[#FF8C42]/10 to-[#FF6B1A]/5 border border-[#FF8C42]/20" : ""
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] flex items-center justify-center text-white flex-shrink-0">
                                {getConversationAvatar(conv)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <span className={`font-semibold text-sm truncate ${isActive ? "text-[#FF6B1A]" : "text-[#2D2D2D]"}`}>
                                        {getConversationName(conv)}
                                    </span>
                                    {lastMessageTime && (
                                        <span className="text-xs text-[#6B6B6B] ml-2 flex-shrink-0">{lastMessageTime}</span>
                                    )}
                                </div>
                                <p className="text-sm text-[#6B6B6B] truncate">
                                    {conv.lastMessage?.sender.id === session?.user?.id && "You: "}
                                    {lastMessagePreview}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
