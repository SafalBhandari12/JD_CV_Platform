import bcrypt from "bcryptjs";
import envConfig from "../../config/getEnvConfig";
import jwt from "jsonwebtoken";
import upload from "../../helpers/upload";

export type OtpExpiresAtGenerator = { otp: string; expiresAt: Date };

export const otpExpiresAtGenerator = (): OtpExpiresAtGenerator => {
  // 6 digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Set expiration time to 5 minutes from now
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  return { otp, expiresAt };
};

export const hashedPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (
  password: string,
  hashedPassword: string
): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const signedAccessToken = (payload: object): string => {
  return jwt.sign(payload, envConfig.ACCESS_SECRET, { expiresIn: "1h" });
};

export const signedRefreshToken = (payload: object): string => {
  return jwt.sign(payload, envConfig.REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): object => {
  try {
    return jwt.verify(token, envConfig.ACCESS_SECRET) as object;
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

// In src/helpers/upload.ts
export const uploadFieldsRegistrationUser = upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 },
]);

export const uploadFieldsRegistrationOrg = upload.fields([
  { name: "logo", maxCount: 1 },
]);

export const verifyRefreshToken = (token: string): object => {
  try {
    return jwt.verify(token, envConfig.REFRESH_SECRET) as object;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
