import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL as string;
export const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN as string;