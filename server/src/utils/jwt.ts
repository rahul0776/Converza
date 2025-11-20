import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): { userId: string } | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded;
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): { userId: string } | null => {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
        return decoded;
    } catch (error) {
        return null;
    }
};
