import { type Request } from 'express';

/**
 * Interface representing the structure of the authenticated user payload.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
}

/**
 * Extends the default Express Request object to include the authenticated user property.
 * This is used by the authentication middleware to attach user data.
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
