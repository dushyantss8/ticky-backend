// Combine all routes of app here
import { Router } from "express";
import { healthRouter } from "./health.route";
import { authRouter } from "./auth.route";
import { userTaskRouter } from "./user.task.route";
import { adminTaskRouter } from "./admin.task.route";

export const routes = Router();

// plugging in all routes here
routes.use("/health", healthRouter);
routes.use("/auth", authRouter);
routes.use("/user/tasks", userTaskRouter);
routes.use("/admin/tasks", adminTaskRouter);