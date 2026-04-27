import { Request,Response,NextFunction } from "express"
import { authServise } from "../services/auth.service"


export const authController={
    register:async(req: Request, res:Response, next: NextFunction)=>{
        try {
            // const user = await authServise.register(req.body)
            const result = await authServise.register(req.body)
            res.cookie("accessToken", result.accessToken,{
                httpOnly: true,
                secure: true,          // production = true
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path:"/"
            });
            res.status(201).json({message: "user succesfuly registered", result:result.user})
        } catch (e) {
            next(e)
        }
    },
    login:async(req: Request, res:Response, next: NextFunction)=>{
        try {
            const result= await authServise.login(req.body)
            res.cookie("accessToken", result.accessToken,{
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path:"/"
            });
            res.status(200).json({message:"user succesfuly loged in", result:result.user})
        } catch (e) {
            next(e)
        }
    },
    me:async(req: Request, res:Response, next: NextFunction)=>{
    
        res.status(200).json({message:true, user:(req as any).user})
      
    },
    healthCheck:async(req: Request, res:Response, next: NextFunction)=>{
    
        res.status(200).json({message:"Every thing is right"})
      
    },
}