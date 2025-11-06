import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | undefined;

export async function getRedisClient(): Promise<RedisClientType> {
  if (client && client.isOpen) return client;
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL is not set');
  }
  client = createClient({ url });
  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });
  await client.connect();
  return client;
}

