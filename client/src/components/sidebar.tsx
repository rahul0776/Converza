"use client";

import { MessageCircle, Search, LogOut, Plus } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ConversationList } from "./conversation-list";
import { NewConversationModal } from "./new-conversation-modal";
import { useState } from "react";

export function Sidebar() {
    const { data: session } = useSession();
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
    };

    const getUserInitial = () => {
        if (session?.user?.name) {
            return session.user.name.charAt(0).toUpperCase();
        }
        if (session?.user?.email) {
            return session.user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    return (
        <>
            <div className="w-80 bg-white border-r border-[#FFE5D0] flex flex-col h-full shadow-sm">
                {/* Header */}
                <div className="p-6 border-b border-[#FFE5D0]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] flex items-center justify-center shadow-lg">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] bg-clip-text text-transparent">
                            Converza
                        </h1>
                    </div>

                    {/* New Chat Button */}
                    <button
                        onClick={() => setIsNewChatOpen(true)}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Chat
                    </button>
                </div>

                {/* Conversations */}
                <ConversationList />

                {/* User Profile */}
                <div className="p-4 border-t border-[#FFE5D0] bg-gradient-to-r from-[#FFF8F0] to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] flex items-center justify-center text-white font-bold shadow-md">
                            {getUserInitial()}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-[#2D2D2D]">{session?.user?.name || 'User'}</p>
                            <p className="text-xs text-[#6B6B6B]">Online</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-[#FFE5D0] rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5 text-[#6B6B6B]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* New Conversation Modal */}
            <NewConversationModal
                isOpen={isNewChatOpen}
                onClose={() => setIsNewChatOpen(false)}
            />
        </>
    );
}
