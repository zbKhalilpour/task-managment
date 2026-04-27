
import { prisma } from "../config/prisma"
import { AppError } from "../utils/AppError";

type creatTaskInput={title: string, description: string }
type updateTaskInput=  { text?: string; assignedTo?: string }


export const tasksService={
    async getTasks(userId?: string ){
        return prisma.task.findMany({
            where: userId? { assignedTo:userId } : {},
            orderBy: { createdAt: "desc" },
            include: { comments: true , assignee: { select: { name: true, email: true } } }
        });
    },

    async createTask(createdBy:string, input:creatTaskInput){

        const title=(input?.title ?? "").trim()
        const description=(input?.description ?? "").trim()

        if(!title || !description ) throw new AppError("title & description are required", 400)
        
        return prisma.task.create({
            data : {createdBy,title,description}
        })
    },

    async deleteTask(taskId :string){
        if(!taskId) throw new AppError("taskid required",400)
        return prisma.task.delete({
            where:{id:taskId}
        })
    },

    async updateTask(userId: string, taskId: string, input:updateTaskInput){
        
        if(!taskId || !userId) {throw new AppError("taskid-userId required",400)}

        if(input.text){
            return await prisma.comment.create({
                data:{userId, taskId, text:input.text}
            })
        }
        
        if (input.assignedTo) {
            const assignedUser = await prisma.user.findUnique({
                where: { email: input.assignedTo }
            });

            if (!assignedUser)
                throw new AppError("User not found", 404);

            return prisma.task.update({
                where: { id: taskId },
                data: { assignedTo: assignedUser.id }
            });
        }
    }
}