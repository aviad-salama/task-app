import { db } from '../prisma/db.js';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string | Date | any;
}

/**
 * Creates a new user record in the database.
 */
export async function createUser(email: string, passwordHash: string, name: string): Promise<User> {
  // Use 'as any' to bypass the strict Char<36> requirement for generated fields
  const newUser = await db.orm.public.User.create({
    email: email,
    password_hash: passwordHash,
    name: name.trim(),
  } as any);
  
  return newUser as unknown as User;
}

/**
 * Retrieves a user record by their email address.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await db.orm.public.User.where({ email: email }).first();
  return (user as unknown as User) || null;
}