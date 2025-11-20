import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyAccessToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.userId = decoded.userId;
    next();
};
