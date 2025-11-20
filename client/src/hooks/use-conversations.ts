import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Types
export interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    sender: User;
}

export interface Conversation {
    id: string;
    name: string | null;
    isGroup: boolean;
    participants: User[];
    lastMessage?: Message | null;
    messageCount?: number;
    updatedAt: string;
}

// Fetch all conversations
export function useConversations() {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/conversations`, {
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch conversations');
            return res.json() as Promise<Conversation[]>;
        },
        enabled: !!session?.accessToken
    });
}

// Fetch a specific conversation
export function useConversation(conversationId: string | null) {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ['conversation', conversationId],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/conversations/${conversationId}`, {
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch conversation');
            return res.json() as Promise<Conversation>;
        },
        enabled: !!session?.accessToken && !!conversationId
    });
}

// Fetch messages for a conversation
export function useConversationMessages(conversationId: string | null) {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch messages');
            return res.json() as Promise<Message[]>;
        },
        enabled: !!session?.accessToken && !!conversationId
    });
}

// Create a new conversation
export function useCreateConversation() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { participantIds: string[]; name?: string; isGroup: boolean }) => {
            const res = await fetch(`${API_URL}/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to create conversation');
            return res.json() as Promise<Conversation>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
    });
}

// Search for users
export function useUserSearch(query: string) {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ['users', 'search', query],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            });
            if (!res.ok) throw new Error('Failed to search users');
            return res.json() as Promise<User[]>;
        },
        enabled: !!session?.accessToken && query.length > 0
    });
}
