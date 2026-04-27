import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { prisma } from "../config/prisma";


export async function requiredAuth(req: Request, res: Response, next: NextFunction){
    try {


        //jwt az cookie miyad pas cookie ro check konam
        // const header = req.headers.authorization;

        // if (!header?.startsWith("Bearer ")) {
        //     throw new AppError("Unauthorized", 401);
        // }

        // const token = header.slice("Bearer ".length);

        const token = (req as any).cookies?.token;
        // console.log(req);
        
        if (!token) {
            throw new AppError("Unauthorized", 401);
        }


        const payload= jwt.verify(token, env.JWT_ACCESS_SECRET) as {sub:string, role:string}

        const user=await prisma.user.findUnique({
            where : {id:payload.sub},
            select :{ id: true, name: true, email: true, role: true, createdAt: true}
        })

        if (!user) {
            throw new AppError("Unauthorized", 401);
        }
            
           
    

        (req as any).user = user;
        next()
        
    } catch(err) {
         console.log("JWT ERROR:", err);
        next(new AppError("Unauthorized",401))
    }
}