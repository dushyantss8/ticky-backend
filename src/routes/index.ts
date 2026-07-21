// Combine all routes of app here
import { Router } from "express";
import { healthRouter } from "./health.route";
import { authRouter } from "./auth.route";

export const routes = Router();

// plugging in all routes here
routes.use("/health", healthRouter);
routes.use("/auth", authRouter);