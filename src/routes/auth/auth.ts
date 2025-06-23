import { Router } from "express";
import AuthController from "./auth.controller";
import { emailRateLimiter } from "../../helpers/rateLimiter";
import { isAuthenticated, isOrg, isUser } from "./auth.middleware";
import upload from "../../helpers/upload";
import {
  uploadFieldsRegistrationOrg,
  uploadFieldsRegistrationUser,
} from "./auth.helper";

const router = Router();

router.post(
  "/init-registration",
  emailRateLimiter,
  AuthController.InitialRegistration
);

router.post("/login", AuthController.Login);
router.post("/verify-otp", AuthController.VerifyOtp);
router.post(
  "/registerUser",
  isAuthenticated,
  isUser,
  uploadFieldsRegistrationUser,
  AuthController.RegistrationUser
);
router.post(
  "/registerOrg",
  isAuthenticated,
  isOrg,
  uploadFieldsRegistrationOrg,
  AuthController.RegistrationOrg
);

export default router;
