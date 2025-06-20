import dotenv from 'dotenv';
dotenv.config();
const envConfig = {
  PORT: Number(process.env.PORT) || 3000,
  DB_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/myapp",
  JWT_SECRET: process.env.JWT_SECRET || "my-secret-key",
};

export default envConfig;
