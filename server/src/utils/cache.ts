import { redis } from '../config/redis';
import { logger } from './logger';

export const getCache = async (key: string) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error({ err: error }, `Error getting cache for key: ${key}`);
    return null;
  }
};

export const setCache = async (key: string, value: any, ttlSeconds: number = 300) => {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (error) {
    logger.error({ err: error }, `Error setting cache for key: ${key}`);
  }
};

export const deleteCache = async (keyPattern: string) => {
  try {
    const keys = await redis.keys(keyPattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    logger.error({ err: error }, `Error deleting cache for pattern: ${keyPattern}`);
  }
};
