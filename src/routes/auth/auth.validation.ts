import vine from "@vinejs/vine";
import CustomErrorReporter from "../../config/CustomErrorReporter";

vine.errorReporter = () => new CustomErrorReporter();

export const initialRegistrationSchema = vine.compile(
  vine.object({
    email: vine.string().email(),
    role: vine.enum(["ORG", "USER"]),
  })
);
