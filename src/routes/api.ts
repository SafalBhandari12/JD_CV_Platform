import { Router } from "express";
import authRouter from "./auth/auth";

const router = Router();

// Auth Route
router.use("/auth", authRouter);

export default router;
