import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { getRedisClient } from '../db/redis.js';

type ShouldCacheFn = (req: Request, res: Response, body: unknown) => boolean;

type CacheOptions<TId extends string = string> = {
  ttlSeconds?: number;
  prefix?: string;
  keyGenerator?: (req: Request) => TId;
  shouldCache?: ShouldCacheFn;
};

const defaultShouldCache: ShouldCacheFn = (_req, res) => res.statusCode === 200;

export function cacheGetRedis(options: CacheOptions = {}): RequestHandler {
  const ttlSeconds = options.ttlSeconds ?? 60;
  const prefix = options.prefix ?? 'cache';
  const keyGen = options.keyGenerator ?? ((req) => req.originalUrl);
  const shouldCache: ShouldCacheFn = options.shouldCache ?? defaultShouldCache;
  // console.log(`Cache middleware initialized with prefix="${prefix}", ttl=${ttlSeconds}s`);
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next();

    try {
      const client = await getRedisClient();
      const id = keyGen(req);
      const key = `${prefix}:${id}`;
      const cached = await client.get(key);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        res.json(JSON.parse(cached));
        return;
      }
      // console.log(`Cache MISS for key: ${key}`);
      const originalJson = res.json.bind(res);
      res.json = ((body: unknown) => {
        try {
          if (shouldCache(req, res, body)) {
            void getRedisClient().then((c) => c.set(key, JSON.stringify(body), { EX: ttlSeconds }));
            res.setHeader('X-Cache', 'MISS');
          }
        } catch {
        }
        return originalJson(body);
      }) as typeof res.json;

      next();
    } catch {
      next();
    }
  };
}

export async function invalidateCache(prefix: string, id: string): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.del(`${prefix}:${id}`);
  } catch {
  }
}
