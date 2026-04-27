import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { requiredAuth } from "../middlewares/requiredAuth";
// import { request } from "express";
export const authRouter= Router()
// console.log(request);
authRouter.post("/register",authController.register)
authRouter.post("/login",authController.login)
authRouter.get("/me",requiredAuth,authController.me)
authRouter.get("/health",authController.healthCheck)