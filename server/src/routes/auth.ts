import { Router } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

const router = Router();
const prisma = new PrismaClient();

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0], // Use email prefix as default name
            },
        });

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Return user data (without password) and tokens
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        if (!user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Return user data (without password) and tokens
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        // Generate new access token
        const accessToken = generateAccessToken(decoded.userId);

        res.json({ accessToken });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Token refresh failed' });
    }
});

export default router;
