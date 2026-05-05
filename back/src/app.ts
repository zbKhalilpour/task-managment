import express, { NextFunction }  from "express";
import { authRouter } from "./routes/auth.rout";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import morgan from "morgan";
import { tasksRouter } from "./routes/taskes.rout";
import cookieParser from "cookie-parser"
import { notFound } from "./middlewares/notFound";
import { usersRouter } from "./routes/users.rout";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swager";

export const app=express()

//global middlewares
// app.use(cors({ origin: true, credentials: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

//rout-level middleware

app.use("/auth" , authRouter)
app.use("/tasks" , tasksRouter)
app.use("/users",usersRouter)

// Swagger UI Path
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//errorHandler middleware
app.use(notFound);
app.use(errorHandler);