// src/constants/allowedMimeTypes.ts
export const allowedResumeMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const allowedImageMimeTypes = ["image/jpeg", "image/png"];

export const allAllowedMimeTypes = [
  ...allowedResumeMimeTypes,
  ...allowedImageMimeTypes,
];
