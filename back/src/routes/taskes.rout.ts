import { Router } from "express";
import { requiredAuth } from "../middlewares/requiredAuth";
import { tasksController } from "../controllers/tasks.controller";
import { requiredRole } from "../middlewares/requiredRole";

export  const tasksRouter=Router()

tasksRouter.use(requiredAuth)

//read tasks
tasksRouter.get("/mytasks",requiredRole("USER","LEADER"),tasksController.listMine)
//update task
tasksRouter.patch("/:id",tasksController.updateTask)




tasksRouter.use(requiredRole("LEADER"))
//read tasks
tasksRouter.get("/", tasksController.listAllTasks)
//create task
tasksRouter.post("/", tasksController.createTask)
//delete task
tasksRouter.delete("/:id", tasksController.deleteTask)


