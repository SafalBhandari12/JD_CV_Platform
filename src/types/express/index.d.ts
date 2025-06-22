import * as multer from "multer";

declare global {
  namespace Express {
    namespace Multer {
      interface File extends multer.File {}
    }

    interface Request {
      files?: {
        [fieldname: string]: Express.Multer.File[];
      };
    }
  }
}

export {};
