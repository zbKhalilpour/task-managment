import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { requiredAuth } from "../middlewares/requiredAuth";
import { requiredRole } from "../middlewares/requiredRole";

export const usersRouter = Router();

usersRouter.use(requiredAuth);
usersRouter.use(requiredRole("ADMIN"));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: User management APIs (ADMIN only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserOutput:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           example: "USER"
 *
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/UserOutput"
 */
usersRouter.get("/", usersController.getUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateUserInput"
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user succesfuly registered
 *                 User:
 *                   $ref: "#/components/schemas/UserOutput"
 */
usersRouter.post("/", usersController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user details (ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateUserInput"
 *     responses:
 *       200:
 *         description: User updated successfully
 */
usersRouter.patch("/:id", usersController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
usersRouter.delete("/:id", usersController.deleteUser);
