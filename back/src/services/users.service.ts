import bcrypt from "bcrypt"
import { prisma }  from "../config/prisma"
import { AppError } from "../utils/AppError"

// enum Role  {"LEADER","USER"}
// type RegisterInput ={name: string, email:string, password:string, role:Role}
type RegisterInput ={name: string, email:string, password:string}
type updateInput=  { email?: string, name?: string}

export const usersService={
    async getUsers (){
        return prisma.user.findMany({});
    },

    async createUser (input:RegisterInput){
        const name=(input?.name ?? "").trim()
        const email=(input?.email ?? "").trim().toLowerCase()
        const password=input?.password ?? ""

        if (!name || !email || !password) throw new AppError ("name, email, password are required", 400)

        const exists= await prisma.user.findUnique ({where : {email}})
        if(exists) throw new AppError ("email already exist",409)

        const passwordHash = await bcrypt.hash(password, 10);
        // const role=input.role -> modify later
        const role="USER"

        const user = await prisma.user.create({
            data: { name, email, passwordHash, role}
        })
        return{
            user:user
        }
    },

    async updateUser (userId:string, input:updateInput){
        if(!userId) throw new AppError ("userId required",400)
        
        return prisma.user.update({
                where: { id: userId },
                data: {email:input.email , name:input.name}
            });
    },

    async deleteUser (userId: string){
        if(!userId) throw new AppError ("userId required",400)

        return prisma.user.delete({
            where :{id: userId}
        })
    }
}