import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { requiredAuth } from "../middlewares/requiredAuth";

export const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication & authorization APIs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 *
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Ali
 *         email:
 *           type: string
 *           example: ali@gmail.com
 *         password:
 *           type: string
 *           example: 12345678
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: ali@gmail.com
 *         password:
 *           type: string
 *           example: 12345678
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clt31s0q000a8893k7lbczi5r"
 *         name:
 *           type: string
 *           example: Ali
 *         email:
 *           type: string
 *           example: ali@gmail.com
 *         role:
 *           type: string
 *           example: USER
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterInput"
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: "#/components/schemas/User"
 */
authRouter.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginInput"
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=jwt-token; HttpOnly; Path=/; Max-Age=604800;
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: "#/components/schemas/User"
 */
authRouter.post("/login", authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user (from cookie JWT)
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: boolean
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *       401:
 *         description: Unauthorized (invalid or missing cookie)
 */
authRouter.get("/me", requiredAuth, authController.me);

/**
 * @swagger
 * /auth/health:
 *   get:
 *     summary: Auth service health check
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Every thing is right
 */
authRouter.get("/health", authController.healthCheck);
