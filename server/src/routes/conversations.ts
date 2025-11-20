import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all conversations for the authenticated user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1,
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        messages: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Format response with last message and participant info
        const formattedConversations = conversations.map(conv => ({
            id: conv.id,
            name: conv.name,
            isGroup: conv.isGroup,
            participants: conv.participants.map(p => p.user),
            lastMessage: conv.messages[0] || null,
            messageCount: conv._count.messages,
            updatedAt: conv.updatedAt
        }));

        res.json(formattedConversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// Create a new conversation (DM or group)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const { participantIds, name, isGroup } = req.body;

        if (!participantIds || !Array.isArray(participantIds)) {
            return res.status(400).json({ error: 'participantIds must be an array' });
        }

        // For DMs, check if conversation already exists
        if (!isGroup && participantIds.length === 1) {
            const otherUserId = participantIds[0];

            // Find existing DM between these two users
            const existingConversation = await prisma.conversation.findFirst({
                where: {
                    isGroup: false,
                    AND: [
                        {
                            participants: {
                                some: {
                                    userId: userId
                                }
                            }
                        },
                        {
                            participants: {
                                some: {
                                    userId: otherUserId
                                }
                            }
                        }
                    ]
                },
                include: {
                    participants: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true
                                }
                            }
                        }
                    }
                }
            });

            if (existingConversation) {
                // Format response to match GET endpoint structure
                const formattedConversation = {
                    id: existingConversation.id,
                    name: existingConversation.name,
                    isGroup: existingConversation.isGroup,
                    participants: existingConversation.participants.map(p => p.user),
                    updatedAt: existingConversation.updatedAt
                };
                return res.json(formattedConversation);
            }
        }

        // Create new conversation
        const conversation = await prisma.conversation.create({
            data: {
                name: isGroup ? name : null,
                isGroup: isGroup || false,
                createdById: userId,
                participants: {
                    create: [
                        { userId }, // Add creator
                        ...participantIds.map((id: string) => ({ userId: id }))
                    ]
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });

        // Format response to match GET endpoint structure
        const formattedConversation = {
            id: conversation.id,
            name: conversation.name,
            isGroup: conversation.isGroup,
            participants: conversation.participants.map(p => p.user),
            updatedAt: conversation.updatedAt
        };

        res.status(201).json(formattedConversation);
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
});

// Get a specific conversation
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const { id } = req.params;

        const conversation = await prisma.conversation.findFirst({
            where: {
                id,
                participants: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Format response to match GET endpoint structure
        const formattedConversation = {
            id: conversation.id,
            name: conversation.name,
            isGroup: conversation.isGroup,
            participants: conversation.participants.map(p => p.user),
            updatedAt: conversation.updatedAt
        };

        res.json(formattedConversation);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

// Get messages for a conversation
router.get('/:id/messages', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const { id } = req.params;
        const { limit = '50', before } = req.query;

        // Verify user is participant
        const conversation = await prisma.conversation.findFirst({
            where: {
                id,
                participants: {
                    some: {
                        userId
                    }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const messages = await prisma.message.findMany({
            where: {
                conversationId: id,
                ...(before && {
                    createdAt: {
                        lt: new Date(before as string)
                    }
                })
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: parseInt(limit as string)
        });

        res.json(messages.reverse());
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

export default router;
