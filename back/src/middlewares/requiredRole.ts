import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

import { Role } from "@prisma/client";

type UserRole = Role

export function requiredRole(...roles:UserRole[]){
    return(req:Request, res:Response, next:NextFunction)=>{
        const user=(req as any).user
        if(!user) {
            return next ( new AppError ("Unauthorized", 401))
        }
        if (!roles.includes(user.role)) {
            return next ( new AppError ("Forbbiden", 403))
        }
        next()
    }
}
