import { Request, Response, NextFunction } from "express";
import { errors } from "@vinejs/vine";

function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Always log the error for debugging

  // Handle VineJS validation errors
  if (err instanceof errors.E_VALIDATION_ERROR) {
    res.status(400).json({
      status: "error",
      type: "validation",
      errors: err.messages,
    });
    return;
  }

  // Handle generic errors with a message
  if (err && (err as { message?: unknown }).message) {
    res.status(500).json({
      status: "error",
      message: (err as { message?: unknown }).message,
    });
    return;
  }

  // Fallback for unknown errors
  res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again.",
  });
}

export default errorHandler;
