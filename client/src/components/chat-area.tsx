"use client";

import { Send, Smile, Paperclip, MoreVertical, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getSocket } from "@/lib/socket";
import { useConversationStore } from "@/store/conversation-store";
import { useConversationMessages, useConversation } from "@/hooks/use-conversations";

type Message = {
    id?: string;
    content: string;
    sender: {
        id: string;
        name: string | null;
        email: string;
    };
    createdAt?: string;
    time: string;
};

export function ChatArea() {
    const { data: session } = useSession();
    const { activeConversationId } = useConversationStore();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

    // Fetch conversation details
    const { data: conversation } = useConversation(activeConversationId);

    // Fetch messages for active conversation
    const { data: fetchedMessages, isLoading } = useConversationMessages(activeConversationId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load messages when conversation changes
    useEffect(() => {
        if (fetchedMessages) {
            const formattedMessages = fetchedMessages.map((msg: any) => ({
                id: msg.id,
                content: msg.content,
                sender: msg.sender,
                createdAt: msg.createdAt,
                time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setMessages(formattedMessages);
            setTimeout(scrollToBottom, 100);
        } else {
            setMessages([]);
        }
    }, [fetchedMessages]);

    // Socket.io setup
    useEffect(() => {
        if (!session?.accessToken || !activeConversationId) return;

        const socket = getSocket(session.accessToken);
        socketRef.current = socket;
        socket.connect();

        // Join the active conversation room
        socket.emit('join_conversation', activeConversationId);

        socket.on("receive_message", (data: any) => {
            // Only add if it's not from the current user (avoid duplicates from optimistic update)
            // AND if it's for the active conversation
            if (data.sender.id !== session.user?.id && data.conversationId === activeConversationId) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: data.id,
                        content: data.content,
                        sender: data.sender,
                        createdAt: data.createdAt,
                        time: new Date(data.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    },
                ]);
                setTimeout(scrollToBottom, 100);
            }
        });

        return () => {
            socket.emit('leave_conversation', activeConversationId);
            socket.off("receive_message");
            socket.disconnect();
        };
    }, [session, activeConversationId]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !socketRef.current || !session?.user || !activeConversationId) return;

        socketRef.current.emit("send_message", {
            content: message,
            conversationId: activeConversationId
        });

        // Optimistic update
        setMessages((prev) => [
            ...prev,
            {
                content: message,
                sender: {
                    id: session.user.id,
                    name: session.user.name || 'You',
                    email: session.user.email || ''
                },
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
        ]);
        setMessage("");
        setTimeout(scrollToBottom, 100);
    };

    const isMyMessage = (msg: Message) => {
        return msg.sender.id === session?.user?.id;
    };

    const getConversationName = () => {
        if (!conversation) return "Select a conversation";
        if (conversation.isGroup) {
            return conversation.name || "Unnamed Group";
        }
        const otherParticipant = conversation.participants.find(p => p.id !== session?.user?.id);
        return otherParticipant?.name || otherParticipant?.email || "Unknown User";
    };

    const getParticipantCount = () => {
        return conversation?.participants.length || 0;
    };

    // Show empty state if no conversation is selected
    if (!activeConversationId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#FFFBF7] to-[#FFF8F0]">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] flex items-center justify-center mx-auto mb-4">
                        <Send className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">Welcome to Converza!</h3>
                    <p className="text-[#6B6B6B]">Select a conversation or start a new chat to begin messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-[#FFFBF7] to-[#FFF8F0]">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-[#FFE5D0] shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] flex items-center justify-center text-white font-bold shadow-lg">
                            {conversation?.isGroup ? (
                                <Users className="w-6 h-6" />
                            ) : (
                                getConversationName().charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-[#2D2D2D]">{getConversationName()}</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-[#6B6B6B]">
                                    {getParticipantCount()} participant{getParticipantCount() !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-[#FFF8F0] rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-[#6B6B6B]" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-[#6B6B6B]">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-[#6B6B6B]">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMine = isMyMessage(msg);
                        return (
                            <div key={msg.id || index} className={`flex ${isMine ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[70%]`}>
                                    {!isMine && (
                                        <span className="text-xs font-semibold text-[#FF6B1A] mb-1 px-1">
                                            {msg.sender.name || msg.sender.email}
                                        </span>
                                    )}
                                    <div className={`group relative px-4 py-3 rounded-2xl shadow-sm ${isMine
                                            ? "bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] text-white rounded-br-md"
                                            : "bg-white text-[#2D2D2D] border border-[#FFE5D0] rounded-bl-md"
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                        {isMine && (
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] transform rotate-45"></div>
                                        )}
                                    </div>
                                    <span className="text-xs text-[#6B6B6B] mt-1.5 px-1">{msg.time}</span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[#FFE5D0] shadow-lg">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <button
                        type="button"
                        className="p-2.5 hover:bg-[#FFF8F0] rounded-xl transition-colors"
                    >
                        <Paperclip className="w-5 h-5 text-[#6B6B6B]" />
                    </button>
                    <button
                        type="button"
                        className="p-2.5 hover:bg-[#FFF8F0] rounded-xl transition-colors"
                    >
                        <Smile className="w-5 h-5 text-[#6B6B6B]" />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-[#FFF8F0] border border-[#FFE5D0] rounded-xl text-[#2D2D2D] placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
