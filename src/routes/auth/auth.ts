import { Router } from "express";
import AuthController from "./auth.controller";
import { emailRateLimiter } from "../../helpers/rateLimiter";
import { isAuthenticated } from "./auth.middleware";

const router = Router();

router.post(
  "/init-registration",
  emailRateLimiter,
  AuthController.InitialRegistration
);

router.post("/login", AuthController.Login);

router.post("/register-user", isAuthenticated, AuthController.RegistrationUser);

export default router;
