import { Role } from "../../generated/prisma";
import { MulterFile } from "../../helpers/upload";
export type returnAccessToken = {
    userId: string;
    role: Role
}

// Define a custom interface for the request with files
export interface RequestWithFilesTypes extends Omit<Request, "files"> {
  files?: {
    [fieldname: string]: MulterFile[];
  };
}