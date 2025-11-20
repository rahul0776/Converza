"use client";

import { useState } from "react";
import { useUserSearch, useCreateConversation } from "@/hooks/use-conversations";
import { useConversationStore } from "@/store/conversation-store";
import { X, Search, UserPlus, Users as UsersIcon, Loader2 } from "lucide-react";

interface NewConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewConversationModal({ isOpen, onClose }: NewConversationModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");
    const [isGroup, setIsGroup] = useState(false);

    const { data: searchResults, isLoading: isSearching } = useUserSearch(searchQuery);
    const createConversation = useCreateConversation();
    const { setActiveConversation } = useConversationStore();

    if (!isOpen) return null;

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreate = async () => {
        if (selectedUsers.length === 0) return;

        try {
            const conversation = await createConversation.mutateAsync({
                participantIds: selectedUsers,
                name: isGroup ? groupName : undefined,
                isGroup
            });

            // Switch to the new conversation
            setActiveConversation(conversation.id);

            // Reset and close
            setSearchQuery("");
            setSelectedUsers([]);
            setGroupName("");
            setIsGroup(false);
            onClose();
        } catch (error) {
            console.error("Failed to create conversation:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-[#FFE5D0]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[#2D2D2D]">New Conversation</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[#FFF8F0] rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-[#6B6B6B]" />
                        </button>
                    </div>

                    {/* Group Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsGroup(false)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${!isGroup
                                    ? "bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] text-white"
                                    : "bg-[#FFF8F0] text-[#6B6B6B] hover:bg-[#FFE5D0]"
                                }`}
                        >
                            <UserPlus className="w-4 h-4 inline mr-2" />
                            Direct Message
                        </button>
                        <button
                            onClick={() => setIsGroup(true)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${isGroup
                                    ? "bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] text-white"
                                    : "bg-[#FFF8F0] text-[#6B6B6B] hover:bg-[#FFE5D0]"
                                }`}
                        >
                            <UsersIcon className="w-4 h-4 inline mr-2" />
                            Group Chat
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Group Name (only for groups) */}
                    {isGroup && (
                        <div>
                            <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                                Group Name
                            </label>
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Enter group name..."
                                className="w-full px-4 py-2 bg-[#FFF8F0] border border-[#FFE5D0] rounded-xl text-[#2D2D2D] placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                            />
                        </div>
                    )}

                    {/* Search Users */}
                    <div>
                        <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                            Search Users
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2 bg-[#FFF8F0] border border-[#FFE5D0] rounded-xl text-[#2D2D2D] placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                            />
                        </div>
                    </div>

                    {/* Search Results */}
                    {isSearching && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-[#FF8C42] animate-spin" />
                        </div>
                    )}

                    {searchResults && searchResults.length > 0 && (
                        <div className="space-y-2">
                            {searchResults.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleUserToggle(user.id)}
                                    className={`w-full p-3 rounded-xl text-left transition-all ${selectedUsers.includes(user.id)
                                            ? "bg-gradient-to-r from-[#FF8C42]/10 to-[#FF6B1A]/5 border border-[#FF8C42]/20"
                                            : "bg-[#FFF8F0] hover:bg-[#FFE5D0]"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] flex items-center justify-center text-white font-bold">
                                            {(user.name || user.email).charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-[#2D2D2D]">
                                                {user.name || "Unknown"}
                                            </p>
                                            <p className="text-xs text-[#6B6B6B]">{user.email}</p>
                                        </div>
                                        {selectedUsers.includes(user.id) && (
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {searchQuery && !isSearching && searchResults?.length === 0 && (
                        <p className="text-center text-[#6B6B6B] text-sm py-8">No users found</p>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#FFE5D0]">
                    <button
                        onClick={handleCreate}
                        disabled={selectedUsers.length === 0 || createConversation.isPending || (isGroup && !groupName)}
                        className="w-full py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {createConversation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            `Create ${isGroup ? "Group" : "Conversation"} (${selectedUsers.length} selected)`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
