import vine from "@vinejs/vine";
import CustomErrorReporter from "../../config/CustomErrorReporter";
import { organizationSize, organizationType } from "../../generated/prisma";

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

export const postSchema = vine.compile(
  vine.object({
    title: vine.string().minLength(2).maxLength(64),
    salaryMin: vine.number().min(0),
    salaryMax: vine.number().min(0),
    skills: vine.array(vine.string().minLength(2).maxLength(64)),
    education: vine.array(vine.string().minLength(2).maxLength(64)),
    experience: vine.number().min(0),
    responsibilities: vine.array(vine.string().minLength(2).maxLength(1000)),
    description: vine.string().minLength(2).maxLength(1000),
    deadline: vine.any().parse((value) => {
      const date = new Date(value as string);
      const now = new Date();
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      if (date < now) {
        throw new Error("Deadline must be in the future");
      }
      return date;
    }),
  })
);

export const organizationRegistrationSchema = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(64),
    location: vine.string().minLength(2).maxLength(64),
    description: vine.string().minLength(2).maxLength(500),
    type: vine.enum(organizationType),
    size: vine.enum(organizationSize),
    website: vine.string().url(),
    posts: vine.array(vine.any()).parse((value) => {
      // Parse posts if it comes as a string
      if (typeof value === "string") {
        try {
          return JSON.parse(value) as any[];
        } catch (error) {
          throw new Error("Posts must be a valid array");
        }
      }
      if (Array.isArray(value)) {
        return value as any[];
      }
      throw new Error("Posts must be a valid array");
    }),
  })
);