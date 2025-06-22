import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { limiter } from "../helpers/rateLimiter";

export const setMiddleware = (app: express.Application) => {
  app.use(express.json());

  // Enable CORS for all routes
  app.use(cors());

  app.use(express.urlencoded({ extended: true }));

  // Use Helmet to secure Express apps by setting various HTTP headers
  app.use(helmet());

  // Use morgan for logging HTTP requests
  app.use(morgan("dev"));

  // Rate limiting middleware to limit repeated requests to public APIs
  app.use(limiter);
};
