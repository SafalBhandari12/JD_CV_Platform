import { Request, Response, NextFunction } from "express";
import {
  initialRegistrationSchema,
  loginUserSchema,
  userProfileSchema,
  verifyOtpSchema,
} from "./auth.validation";
import {
  comparePassword,
  hashedPassword,
  otpExpiresAtGenerator,
  OtpExpiresAtGenerator,
  signedAccessToken,
  signedRefreshToken,
} from "./auth.helper";
import prisma from "../../db/db.config";
import { emailQueue, emailQueueName } from "../../jobs/emailQueueJobs";
import { env } from "process";
import fileType from "file-type";
import { allowedImageMimeTypes } from "../../constants/allowedMimeTypes";
import { uploadToAzure } from "../../config/azure.service";
import { returnAccessToken } from "./auth.types";
import { Request as ExpressRequest } from "express";

// Define MulterFile interface
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Define a custom interface for the request with files
interface RequestWithFiles extends Omit<Request, "files"> {
  files?: {
    [fieldname: string]: MulterFile[];
  };
}

class AuthController {
  static async InitialRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, role, password } =
        await initialRegistrationSchema.validate(req.body);
      const { otp, expiresAt }: OtpExpiresAtGenerator = otpExpiresAtGenerator();

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      await prisma.user.create({
        data: {
          email,
          password: hashedPassword(password),
          role,
        },
      });

      // If the email does not exist, create a new token
      await prisma.verificationToken.create({
        data: {
          email,
          otp,
          expiresAt,
        },
      });

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

  static async VerifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = await verifyOtpSchema.validate(req.body);

      // Validate OTP
      const isValid = await prisma.verificationToken.findFirst({
        where: {
          email,
          otp,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (!isValid) {
        res.status(400).json({ message: "Invalid or expired OTP" });
        return;
      }

      // If valid, proceed with registration
      await prisma.user.update({
        where: { email },
        data: {
          registrationStatus: "EMAIL_VERIFIED",
        },
      });

      await prisma.verificationToken.delete({
        where: { email },
      });

      res.json({
        status: "success",
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async Login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = await loginUserSchema.validate(req.body);

      // Validate user credentials
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || comparePassword(password, user.password) === false) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const accessToken = signedAccessToken({
        userId: user.id,
        role: user.role,
      } as returnAccessToken);

      const refreshToken = signedRefreshToken({
        userId: user.id,
      });

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      if (user.registrationStatus !== "FULLY_REGISTERED") {
        res.status(403).json({
          message:
            "User is not fully registered. Please complete your profile.",
          accessToken,
        });
      } else {
        res.status(200).json({
          accessToken,
          role: user.role,
        });
      }
      return;
    } catch (error) {
      next(error);
    }
  }

  static async getRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: "No refresh token provided" });
        return;
      }

      // Verify the refresh token
      const verifiedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!verifiedToken || verifiedToken.expiresAt < new Date()) {
        res.status(401).json({ message: "Invalid or expired refresh token" });
        return;
      }

      // Generate new access token
      const user = await prisma.user.findUnique({
        where: { id: verifiedToken.userId },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const accessToken = signedAccessToken({
        userId: user.id,
        role: user.role,
      } as returnAccessToken);

      res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async Logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: "No refresh token provided" });
        return;
      }

      // Invalidate the refresh token
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      res
        .clearCookie("refreshToken")
        .json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async RegistrationUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if ((req as any).user.role !== "USER") {
        res.status(403).json({ message: "Forbidden: Only users can register" });
        return;
      }
      const { name, location, university, interest, introduction, position } =
        await userProfileSchema.validate(req.body);

      // Cast request to include files
      const reqWithFiles = req as RequestWithFiles;

      let resume: MulterFile | undefined;
      let profilePicture: MulterFile | undefined;
      if (reqWithFiles.files && reqWithFiles.files.resume) {
        resume = reqWithFiles.files.resume[0];
      } else {
        res.status(400).json({ message: "Resume file is required" });
        return;
      }
      if (reqWithFiles.files && reqWithFiles.files.profilePicture) {
        profilePicture = reqWithFiles.files.profilePicture[0];
      } else {
        res.status(400).json({ message: "Profile picture is required" });
        return;
      }
      const resumeType = await fileType.fileTypeFromBuffer(resume.buffer);
      const profilePictureType = await fileType.fileTypeFromBuffer(
        profilePicture.buffer
      );

      if (!resumeType || !allowedImageMimeTypes.includes(resumeType.mime)) {
        res.status(400).json({ message: "Invalid resume file type" });
        return;
      }

      if (
        !profilePictureType ||
        !allowedImageMimeTypes.includes(profilePictureType.mime)
      ) {
        res.status(400).json({ message: "Invalid profile picture file type" });
        return;
      }

      const resumeUrl = await uploadToAzure(
        resume.buffer,
        resume.originalname,
        resume.mimetype
      );
      const profilePictureUrl = await uploadToAzure(
        profilePicture.buffer,
        profilePicture.originalname,
        profilePicture.mimetype
      );

      const userId = (req as any).user.userId;
      const user = await prisma.userProfile.create({
        data: {
          userId,
          name,
          location,
          university: {
            create: {
              name: university.name,
              startYear: university.startYear,
              endYear: university.endYear,
              degree: university.degree,
            },
          },
          interest,
          introduction,
          position,
          resume: resumeUrl,
          profilePicture: profilePictureUrl,
        },
      });

      res.status(201).json({
        status: "success",
      });
      return;
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
