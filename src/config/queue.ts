export const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const defaultJobOptions = {
  attempts: 3, // Number of retry attempts
  backoff: {
    type: "exponential", // Exponential backoff for retries
    delay: 5000, // Delay in milliseconds before retrying
  },
};
