import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import conversationRoutes from './routes/conversations';
import userRoutes from './routes/users';
import { authMiddleware, AuthRequest } from './middleware/auth';
import { verifyAccessToken } from './utils/jwt';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.send('Converza API is running');
});

// Routes
app.use('/auth', authRoutes);
app.use('/conversations', conversationRoutes);
app.use('/users', userRoutes);

// Protected: Get messages (legacy endpoint - kept for backward compatibility)
app.get('/messages', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const messages = await prisma.message.findMany({
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
                createdAt: 'asc'
            }
        });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Socket.io with authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
        return next(new Error('Authentication error: Invalid token'));
    }

    // Attach userId to socket
    socket.data.userId = decoded.userId;
    next();
});

io.on('connection', async (socket) => {
    const userId = socket.data.userId;
    console.log('User connected:', userId, socket.id);

    // Get user info
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        socket.disconnect();
        return;
    }

    // Join all user's conversation rooms
    const userConversations = await prisma.conversationParticipant.findMany({
        where: { userId },
        select: { conversationId: true }
    });

    userConversations.forEach(conv => {
        socket.join(`conversation:${conv.conversationId}`);
        console.log(`User ${user.name} joined room: conversation:${conv.conversationId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
        const { content, conversationId } = data;
        console.log('Message received from', user.name, ':', content, 'in conversation:', conversationId);

        try {
            // Verify user is participant of this conversation
            const participant = await prisma.conversationParticipant.findFirst({
                where: {
                    userId,
                    conversationId
                }
            });

            if (!participant) {
                socket.emit('error', { message: 'You are not a participant of this conversation' });
                return;
            }

            // Save message to database
            const message = await prisma.message.create({
                data: {
                    content,
                    senderId: userId,
                    conversationId
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
                }
            });

            // Update conversation's updatedAt
            await prisma.conversation.update({
                where: { id: conversationId },
                data: { updatedAt: new Date() }
            });

            // Broadcast to all users in the conversation room
            io.to(`conversation:${conversationId}`).emit('receive_message', message);
            console.log('Message broadcasted to conversation:', conversationId);
        } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle joining a new conversation
    socket.on('join_conversation', async (conversationId) => {
        try {
            // Verify user is participant
            const participant = await prisma.conversationParticipant.findFirst({
                where: {
                    userId,
                    conversationId
                }
            });

            if (participant) {
                socket.join(`conversation:${conversationId}`);
                console.log(`User ${user.name} joined conversation: ${conversationId}`);
            }
        } catch (error) {
            console.error('Error joining conversation:', error);
        }
    });

    // Handle leaving a conversation
    socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation:${conversationId}`);
        console.log(`User ${user.name} left conversation: ${conversationId}`);
    });

    // Handle typing indicators
    socket.on('typing_start', async ({ conversationId }) => {
        try {
            // Verify user is participant
            const participant = await prisma.conversationParticipant.findFirst({
                where: { userId, conversationId }
            });

            if (participant) {
                // Broadcast to others in the conversation (exclude sender)
                socket.to(`conversation:${conversationId}`).emit('user_typing', {
                    userId,
                    userName: user.name,
                    conversationId
                });
                console.log(`User ${user.name} started typing in ${conversationId}`);
            }
        } catch (error) {
            console.error('Error handling typing_start:', error);
        }
    });

    socket.on('typing_stop', async ({ conversationId }) => {
        try {
            // Verify user is participant
            const participant = await prisma.conversationParticipant.findFirst({
                where: { userId, conversationId }
            });

            if (participant) {
                // Broadcast to others in the conversation (exclude sender)
                socket.to(`conversation:${conversationId}`).emit('user_stopped_typing', {
                    userId,
                    conversationId
                });
                console.log(`User ${user.name} stopped typing in ${conversationId}`);
            }
        } catch (error) {
            console.error('Error handling typing_stop:', error);
        }
    });

    // Handle marking messages as read
    socket.on('mark_as_read', async ({ messageIds, conversationId }: { messageIds: string[]; conversationId: string }) => {
        try {
            // Verify user is participant
            const participant = await prisma.conversationParticipant.findFirst({
                where: { userId, conversationId }
            });

            if (!participant) return;

            // Mark messages as read (upsert to avoid duplicates)
            const readReceipts = await Promise.all(
                messageIds.map(messageId =>
                    prisma.messageRead.upsert({
                        where: {
                            messageId_userId: {
                                messageId,
                                userId
                            }
                        },
                        update: {},
                        create: {
                            messageId,
                            userId
                        }
                    })
                )
            );

            // Broadcast to conversation that messages were read
            socket.to(`conversation:${conversationId}`).emit('messages_read', {
                messageIds,
                userId,
                userName: user.name,
                readAt: new Date()
            });

            console.log(`User ${user.name} marked ${messageIds.length} messages as read in ${conversationId}`);
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', userId, socket.id);
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
