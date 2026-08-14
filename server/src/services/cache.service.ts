import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  throw new Error('Redis configuration is missing in environment variables.');
}

/**
 * Initialized Upstash Redis Client instance for caching.
 */
export const redis = new Redis({ url, token });

/**
 * Fetches cached data from Redis. Fallbacks gracefully to PostgreSQL if Redis fails.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    return await redis.get<T>(key);
  } catch (error) {
    console.error(`Error fetching key "${key}" from cache:`, error);
    return null;
  }
}

/**
 * Stores data in Redis cache with an Expiration Time (TTL).
 * @param ttlInSeconds Time To Live in seconds (default: 60)
 */
export async function setCache(key: string, data: any, ttlInSeconds: number = 60): Promise<void> {
  try {
    await redis.set(key, data, { ex: ttlInSeconds });
  } catch (error) {
    console.error(`Error setting key "${key}" in cache:`, error);
  }
}

/**
 * Deletes a key from the Redis cache.
 */
export async function clearCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Error deleting key "${key}" from cache:`, error);
  }
}

/**
 * Invalidates all cached task list keys for a specific user.
 * This is called whenever a task list changes to ensure data consistency.
 */
export async function invalidateUserTaskCache(userId: string): Promise<void> {
  await Promise.all([
    clearCache(`tasks:${userId}:all`),
    clearCache(`tasks:${userId}:pending`),
    clearCache(`tasks:${userId}:done`),
  ]);
}