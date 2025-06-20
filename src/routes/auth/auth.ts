import { Router } from "express";
import AuthController from "./auth.controller";

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
 *                password:
 *                  type: string
 *                  format: password
 *      responses:
 *        '200':
 *          description: Initial registration successful
 */

router.post('/init-registration', AuthController.InitialRegistration);

export default router;
