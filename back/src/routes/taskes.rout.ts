import { Router } from "express";
import { requiredAuth } from "../middlewares/requiredAuth";
import { tasksController } from "../controllers/tasks.controller";
import { requiredRole } from "../middlewares/requiredRole";

export  const tasksRouter=Router()

tasksRouter.use(requiredAuth)

//read tasks
tasksRouter.get("/",requiredRole("LEADER"),tasksController.listAllTasks)
tasksRouter.get("/mytasks",requiredRole("USER","LEADER"),tasksController.listMine)

//update task
tasksRouter.patch("/:id",tasksController.updateTask)

//create task
tasksRouter.post("/",requiredRole("LEADER"), tasksController.createTask)

//delete task
tasksRouter.delete("/:id",requiredRole("LEADER"),tasksController.deleteTask)


