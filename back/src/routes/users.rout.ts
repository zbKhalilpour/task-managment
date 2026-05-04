import { Router } from "express";
import {usersController} from "../controllers/users.controller"
import { requiredAuth } from "../middlewares/requiredAuth";
import { requiredRole } from "../middlewares/requiredRole";

export  const usersRouter=Router()

usersRouter.use(requiredAuth)
usersRouter.use(requiredRole("ADMIN"))

//read all users
usersRouter.get("/", usersController.getUsers)
//create user
usersRouter.post("/", usersController.createUser)
//update user
usersRouter.patch("/:id", usersController.updateUser)
//delete user
usersRouter.delete("/:id", usersController.deleteUser)
