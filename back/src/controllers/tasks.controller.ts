import { Request, Response, NextFunction } from "express"
import { tasksService } from "../services/tasks.service"

export const tasksController={
    listAllTasks:
    async(req: Request, res:Response, next: NextFunction)=>{
            try {
                // const userId=(req as any).user.id
                const tasks=await tasksService.getTasks()
                res.status(200).json({message:"success",tasks})
            } catch (err) {
                next(err)
            }
          
        },

    listMine:async(req: Request, res:Response, next: NextFunction)=>{
    try {
            const userId=(req as any).user.id
            const tasks=await tasksService.getTasks(userId)
            res.status(200).json({message:"success",tasks})
        } catch (err) {
            next(err)
        }
    },

    createTask:async(req: Request, res:Response, next: NextFunction)=>{
        try {
            const createdBy= (req as any).user.id
            const task= await tasksService.createTask(createdBy,req.body)
            res.status(200).json({message:"create by leader",task})  
        } catch (err) {
            next(err)
        }
          
    },

    deleteTask:async(req: Request, res:Response, next: NextFunction)=>{
        try {
            const taskId=(req as any).params.id
            await tasksService.deleteTask(taskId)
            res.status(200).json({message:"successfuly deleted"})
        } catch (err) {
            next(err)
        }
    },

    updateTask:async(req: Request, res:Response, next: NextFunction)=>{
         try {
            
            const taskId=(req as any).params.id
            const userId=(req as any).user.id
            await tasksService.updateTask(userId,taskId, req.body)
            res.status(200).json({message:"successfuly update"})
        } catch (err) {
            next(err)
        }
    },

}