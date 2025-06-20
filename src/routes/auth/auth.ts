import { Router } from "express";
import AuthController from "./auth.controller";
import { emailRateLimiter } from "../../config/rateLimiter";

const router = Router();

/** * @swagger
 * /api/auth/init-registration:
 *    post:
 *      summary: Initial registration for a user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                role:
 *                  type: string
 *                  format:  enum
 *                  enum: [ORG, USER]
 *      responses:
 *        '200':
 *          description: Initial registration successful
 */

router.post(
  "/init-registration",
  emailRateLimiter,
  AuthController.InitialRegistration
);

export default router;
