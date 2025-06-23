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
  removeOnComplete: {
    age: 3600, // Wait for 1 hour (3600 seconds) before removing completed jobs
  },
  removeOnFail: 10, // Keep last 10 failed jobs
  timeout: 60000, // Fail job if it runs longer than 60 seconds
};