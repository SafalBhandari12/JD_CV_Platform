import vine from "@vinejs/vine";
import CustomErrorReporter from "../../config/CustomErrorReporter";

vine.errorReporter = () => new CustomErrorReporter();

export const initialRegistrationSchema = vine.compile(
  vine.object({
    email: vine.string().email(),
    role: vine.enum(["ORG", "USER"]),
    password: vine.string().minLength(8).maxLength(64).confirmed(),
  })
);

export const verifyOtpSchema = vine.compile(
  vine.object({
    email: vine.string().email(),
    otp: vine.string().fixedLength(6).regex(/^\d+$/),
  })
);


export const loginUserSchema = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(64),
  })
);

export const userProfileSchema = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(64),
    location: vine.string().minLength(2).maxLength(64),
    university: vine.object({
      name: vine.string().minLength(2).maxLength(64),
      startYear: vine.number().min(1800).max(new Date().getFullYear()),
      endYear: vine
        .number()
        .min(1900)
        .max(new Date().getFullYear() + 10)
        .optional(),
      degree: vine.string().minLength(2).maxLength(64),
    }),
    interest: vine.array(vine.string().minLength(2).maxLength(64)),
    introduction: vine.string().minLength(2).maxLength(500),
    position: vine.string().minLength(2).maxLength(64),
  })
);
