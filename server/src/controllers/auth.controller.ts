import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../services/user.service.js';

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * HTTP Handler for creating a new user account.
 * Validates request data, checks for existing users, and encrypts the password.
 * @returns The newly created user's data (excluding password).
 */
export async function registerHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required strings.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email address is already in use.' });
    }
    // Hash the password with 10 salt rounds for security.
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, passwordHash);

    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
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

    // Compare provided password with stored hashed password.
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      message: 'Logged in successfully.',
      token,
      user: payload,
    });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}