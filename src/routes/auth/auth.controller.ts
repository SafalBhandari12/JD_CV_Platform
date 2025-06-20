import { Request, Response, NextFunction } from "express";
import vine, { errors } from "@vinejs/vine";
import { initialRegistrationSchema } from "./auth.validation";
import { otpExpiresAtGenerator, OtpExpiresAtGenerator } from "./auth.helper";
import prisma from "../../db/db.config";
import { sendMail } from "../../config/mailer";

class AuthController {
  static async InitialRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, role } = await initialRegistrationSchema.validate(
        req.body
      );
      const { otp, expiresAt }: OtpExpiresAtGenerator = otpExpiresAtGenerator();

      await prisma.verificationToken.create({
        data: {
          email: email,
          otp,
          expiresAt,
          role,
        },
      });

      sendMail(email, "OTP", otp);
      res.json({
        status: "success",
        message: "OTP sent successfully",
      });

      return;
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
