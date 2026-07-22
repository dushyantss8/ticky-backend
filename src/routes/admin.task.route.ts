import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AdminMiddleware } from "../middlewares/admin.middleware";
import { AdminTaskService } from "../services/admin.task.service";

export const adminTaskRouter = Router();

adminTaskRouter.use(AuthMiddleware.authenticate, AdminMiddleware.requireAdmin);

/**
 * Gets all tasks for all admin user
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The tasks
 */
adminTaskRouter.get("/", async (req, res, next) => {
  try {
    const tasks = await AdminTaskService.getAdminTasks(req.query);
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Updates a task status
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The task
 */
adminTaskRouter.patch("/:id", async (req, res, next) => {
  try {
    const task = await AdminTaskService.updateTask(req.params.id, req.body.status);
    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});