import { Router } from "express";
import { requiredAuth } from "../middlewares/requiredAuth";
import { tasksController } from "../controllers/tasks.controller";
import { requiredRole } from "../middlewares/requiredRole";

export const tasksRouter = Router();

tasksRouter.use(requiredAuth);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: APIs for task management by users and leaders
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
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clt37z0q200b0893k7zabcd12"
 *         title:
 *           type: string
 *           example: "Prepare project documentation"
 *         description:
 *           type: string
 *           example: "Summarize API endpoints and architecture details"
 *         createdBy:
 *           type: string
 *           example: "clt123456789abcd"
 *         assignedTo:
 *           type: string
 *           example: "clt87654321xyzabc"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Done with setup"
 *               userId:
 *                 type: string
 *                 example: "clt1234567user"
 *
 *     CreateTaskInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           example: "Design user dashboard"
 *         description:
 *           type: string
 *           example: "Dashboard for user analytics and settings"
 *
 *     UpdateTaskInput:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: Comment text (USER/LEADER can add)
 *           example: "Task completed successfully"
 *         assignedTo:
 *           type: string
 *           description: Assign to user (only LEADER)
 *           example: "user@example.com"
 *         role:
 *           type: string
 *           description: "User role performing update (LEADER required to assign task)"
 *           example: "LEADER"
 */

/**
 * @swagger
 * /tasks/mytasks:
 *   get:
 *     summary: Get all tasks assigned to current user
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of tasks assigned to the current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Task"
 *       403:
 *         description: Forbidden (user lacks required role)
 */
tasksRouter.get("/mytasks", requiredRole("USER", "LEADER"), tasksController.listMine);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update task (add comment or reassign task)
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateTaskInput"
 *     responses:
 *       200:
 *         description: Task successfully updated or comment added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: successfuly update
 *       400:
 *         description: Invalid input or missing parameters
 *       404:
 *         description: Task not found
 */
tasksRouter.patch("/:id", tasksController.updateTask);

tasksRouter.use(requiredRole("LEADER"));

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks (LEADER only)
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks in system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Task"
 *       403:
 *         description: Forbidden — only users with LEADER role
 */
tasksRouter.get("/", tasksController.listAllTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create new task (LEADER only)
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateTaskInput"
 *     responses:
 *       200:
 *         description: Task successfully created by leader
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: create by leader
 *                 task:
 *                   $ref: "#/components/schemas/Task"
 *       400:
 *         description: Missing title or description
 *       403:
 *         description: Forbidden (only leaders can create)
 */
tasksRouter.post("/", tasksController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task (LEADER only)
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID to delete
 *     responses:
 *       200:
 *         description: Task successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: successfuly deleted
 *       404:
 *         description: Task not found
 *       403:
 *         description: Forbidden (LEADER only)
 */
tasksRouter.delete("/:id", tasksController.deleteTask);
