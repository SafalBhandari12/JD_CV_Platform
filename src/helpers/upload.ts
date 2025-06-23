// src/utils/upload.ts
import multer from "multer";
import { allAllowedMimeTypes } from "../constants/allowedMimeTypes";

// Define the file interface
export interface MulterFile {
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

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Express.Request,
  file: MulterFile,
  cb: multer.FileFilterCallback
) => {
  if (allAllowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

export default upload;
