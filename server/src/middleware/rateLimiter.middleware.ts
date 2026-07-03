import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis';

// General API rate limiter (e.g., 100 requests per 15 minutes per IP)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  requestPropertyName: 'globalRateLimit', // Prevent double-count error
  store: new RedisStore({
    // @ts-expect-error - Known typing issue with ioredis and rate-limit-redis in some versions
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl_global:', // Unique prefix for Redis keys
  }),
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// Strict rate limiter for Authentication routes (e.g., login/register) to prevent brute force
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login/register requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  requestPropertyName: 'authRateLimit', // Prevent double-count error
  store: new RedisStore({
    // @ts-expect-error
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl_auth:', // Unique prefix for Redis keys
  }),
  message: {
    message: 'Too many authentication attempts from this IP, please try again after an hour',
  },
});
