import bcrypt from "bcrypt"
import jwt , {SignOptions }from "jsonwebtoken"
import { prisma }  from "../config/prisma"
import { AppError } from "../utils/AppError"
import { env } from "../config/env"



type RegisterInput ={name: string, email:string, password:string}
type LoginInput ={name: string, email:string, password:string}

function signAccessToken(payload:object){
     const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as number,
  }
  
    return jwt.sign(
        payload,
        env.JWT_ACCESS_SECRET as string,
        options
    )
}

function toSafeUser(user: { id: string, name: string, email: string, role: any, createdAt: Date }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
}

export const authServise={
    async register (input: RegisterInput){
        const name=(input?.name ?? "").trim()
        const email=(input?.email ?? "").trim().toLowerCase()
        const password=input?.password ?? ""

        if (!name || !email || !password) throw new AppError ("name, email, password are required", 400)
        // if(password.length < 8) throw new AppError("password must be at least 8 character", 400)

        const exists= await prisma.user.findUnique ({where : {email}})
        if(exists) throw new AppError ("email already exist",409)

        const passwordHash = await bcrypt.hash(password, 10);
        const role="USER"

        const user = await prisma.user.create({
            data: { name, email, passwordHash, role}
        })

        const accessToken= signAccessToken({sub:user.id, role:user.role})
        // console.log(accessToken);
        // return toSafeUser(user)
        
        return{
            accessToken,
            user:toSafeUser(user)
        }
    },
    async login (input: LoginInput){
        const email=(input?.email ?? "").trim().toLowerCase()
        const password=(input?.password ?? "")

        if (!email || !password) throw new AppError ("email and password are required", 400)
        
        const user= await prisma.user.findUnique({where :{email}})
        if (!user) throw new AppError ("invalid credential!", 401)

        const compareToken:boolean=await bcrypt.compare(password,user.passwordHash)
        if(!compareToken) throw new AppError ("invalid credential", 401)

        const accessToken= signAccessToken({sub:user.id, role:user.role})

        return{
            accessToken,
            user:toSafeUser(user)
        }
    }
}

