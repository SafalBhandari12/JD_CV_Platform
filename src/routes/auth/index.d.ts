import { File as MulterFile } from "multer";

declare global {
  namespace Express {
    interface Request {
      files?: {
        [fieldname: string]: MulterFile[];
      };
    }
  }
}
