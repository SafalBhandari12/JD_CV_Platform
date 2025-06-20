import redis from "express-redis-cache";

const redisCache = redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  auth_pass: process.env.REDIS_PASSWORD || "",
  expire: 60 * 60, // Cache expiration time in seconds
});

export default redisCache;