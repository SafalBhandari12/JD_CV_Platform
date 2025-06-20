export type OtpExpiresAtGenerator = { otp: string; expiresAt: Date };

export const otpExpiresAtGenerator = (): OtpExpiresAtGenerator => {
  // 6 digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Set expiration time to 5 minutes from now
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  return { otp, expiresAt };
};
