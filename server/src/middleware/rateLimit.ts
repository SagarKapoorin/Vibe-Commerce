import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { getRedisClient } from '../db/redis.js';

type RateLimitOptions = {
  windowSeconds?: number;
  max?: number;
  prefix?: string;
  keyGenerator?: (req: Request) => string;
};

function defaultKey(req: Request): string {
  return req.ip||'global';
}
//15 minutes window, 100 requests max
export function rateLimitRedis(options: RateLimitOptions = {}): RequestHandler {
  const windowSeconds = options.windowSeconds ?? 15 * 60;
  const max = options.max ?? 100; 
  const prefix = options.prefix ?? 'rl';
  const keyGen = options.keyGenerator ?? defaultKey;
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await getRedisClient();
      const id = keyGen(req);
      const nowSec = Math.floor(Date.now() / 1000);
      const windowStart = Math.floor(nowSec / windowSeconds) * windowSeconds;
      const resetAt = windowStart + windowSeconds; 
      const key = `${prefix}:${id}:${windowStart}`;
      // console.log("Rate limiting key:", key);
      const tx = client.multi();
      tx.incr(key);
      tx.expire(key, windowSeconds, 'NX');
      const [countReply] = (await tx.exec()) ?? [];
      // console.log("Rate limit count for key", key, "is", countReply);
      const current = typeof countReply === 'number' ? countReply : Number(countReply ?? 0);
      // console.log(`Rate limit for ${id}: ${current}/${max} in current window`); 
      const remaining = Math.max(0, max - current);
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(remaining));
      res.setHeader('X-RateLimit-Reset', String(resetAt));
      // console.log(`Rate limit for ${id}: ${current}/${max} in current window`);
      if (current > max) {
        res.status(429).json({ error: 'Too Many Requests' });
        return;
      }
      next();
    } catch (err) {
      console.error('Rate limiter error:', err);
      next();
    }
  };
}

