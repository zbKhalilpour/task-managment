import { Request, Response, NextFunction } from "express"
import { usersService } from "../services/users.service"

export const usersController={
    getUsers:
    async(req: Request, res:Response, next: NextFunction)=>{
            try {
                const users=await usersService.getUsers()
                res.status(200).json({message:"success",users})
            } catch (err) {
                next(err)
            }
          
        },

    createUser:async(req: Request, res:Response, next: NextFunction)=>{
        try {
            const User= await usersService.createUser(req.body)
            res.status(200).json({message:"user succesfuly registered",User})  
        } catch (err) {
            next(err)
        }
          
    },

    updateUser:async(req: Request, res:Response, next: NextFunction)=>{
         try {
            const userId=(req as any).params.id
            await usersService.updateUser(userId, req.body)
            res.status(200).json({message:"User successfuly update"})
        } catch (err) {
            next(err)
        }
    },

     deleteUser:async(req: Request, res:Response, next: NextFunction)=>{
        try {
            const userId=(req as any).params.id
            await usersService.deleteUser(userId)
            res.status(200).json({message:"User successfuly deleted"})
        } catch (err) {
            next(err)
        }
    },

}