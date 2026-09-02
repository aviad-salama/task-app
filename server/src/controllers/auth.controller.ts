import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../services/user.service.js';
import { JWT_SECRET } from '../config/env.js';

/**
 * HTTP Handler for creating a new user account.
 * Validates request data, checks for existing users, and encrypts the password.
 * @returns The newly created user's data (excluding password).
 */
export async function registerHandler(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    // Strict validation: Require name, email, and password
    if (
      !email || typeof email !== 'string' || 
      !password || typeof password !== 'string' || 
      !name || typeof name !== 'string' || name.trim() === ''
    ) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email address is already in use.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, passwordHash, name);

    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * HTTP Handler for authenticating a user.
 * Validates credentials and returns a signed JWT token on success.
 * Embeds name in JWT payload.
 */
export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Embed mandatory name into JWT payload
    const payload = { id: user.id, email: user.email, name: user.name || '' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    return res.json({ token });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

}