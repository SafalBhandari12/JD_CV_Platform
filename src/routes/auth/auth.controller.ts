import { Request, Response, NextFunction } from "express";
import vine, { errors } from "@vinejs/vine";
import { initialRegistrationSchema } from "./auth.validation";
import { otpExpiresAtGenerator, OtpExpiresAtGenerator } from "./auth.helper";
import prisma from "../../db/db.config";
import { sendMail } from "../../config/mailer";
import { emailQueue, emailQueueName } from "../../jobs/emailQueueJobs";

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

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      // Check if the email already exists in the verificationToken table
      const existingToken = await prisma.verificationToken.findUnique({
        where: { email },
      });
      if (existingToken) {
        // If the email already exists, update the existing token
        await prisma.verificationToken.update({
          where: { email },
          data: {
            otp,
            expiresAt,
            role,
          },
        });
      } else {
        // If the email does not exist, create a new token
        await prisma.verificationToken.create({
          data: {
            email,
            otp,
            expiresAt,
            role,
          },
        });
      }

      await emailQueue.add(emailQueueName, {
        email,
        subject: "OTP",
        body: otp,
      });
      
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
