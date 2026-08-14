import { pool } from '../config/database.js';

/**
 * Interface representing the User entity in the database.
 */
export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

/**
 * Persists a new user in the database.
 * The password hash must be generated before calling this function.
 * @returns The newly created user object, excluding the password hash.
 */
export async function createUser(email: string, passwordHash: string): Promise<User> {
  const query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at;';
  const result = await pool.query(query, [email, passwordHash]);
  return result.rows[0] as User;
}

/**
 * Fetches a user from the database by email address.
 * @returns The user object or null if not found.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const query = 'SELECT * FROM users WHERE email = $1;';
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
}