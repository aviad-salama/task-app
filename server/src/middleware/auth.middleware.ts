import { type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { type AuthenticatedRequest, type AuthenticatedUser } from '../types/express.d.js';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables.');
}

/**
 * Middleware function to authenticate JWT tokens from the 'Authorization' header.
 * Verified tokens are decoded, and the payload is attached to req.user.
 * Blocks requests that have missing, invalid, or expired tokens (401/403).
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing.' });
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ error: 'Invalid or expired access token.' });
    }
    // Explicit casting to match extended Express type
    req.user = user as AuthenticatedUser;
    next();
  });
}