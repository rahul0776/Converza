import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Search for users
router.get('/search', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { q } = req.query;
        const currentUserId = req.userId!;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        id: {
                            not: currentUserId // Exclude current user
                        }
                    },
                    {
                        OR: [
                            {
                                name: {
                                    contains: q,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                email: {
                                    contains: q,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            },
            take: 10
        });

        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
});

export default router;
