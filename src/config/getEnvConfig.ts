import dotenv from 'dotenv';
dotenv.config();
const envConfig = {
  PORT: Number(process.env.PORT) || 3000,
  DB_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/myapp",
  JWT_SECRET: process.env.JWT_SECRET || "my-secret-key",
  SMTP_USER:process.env.SMTP_USER,
  SMTP_PASSWORD:process.env.SMTP_PASSWORD,
  HOST: process.env.HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT),
  SMTP_SECURE: process.env.SMTP_SECURE,
  EMAIL_FROM: process.env.EMAIL_FROM,
  AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING || "",
  AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME || "",
  ACCESS_SECRET: process.env.ACCESS_SECRET || "my-secret",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "my-secret",

};


export default envConfig;
