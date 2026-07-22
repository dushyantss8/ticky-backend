import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserTaskService } from "../services/user.task.service";

export const userTaskRouter = Router();

userTaskRouter.use(AuthMiddleware.authenticate);

/**
 * Creates a task for a user
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The created task
 */
userTaskRouter.post("/", async (req, res, next) => {
  try {
    const task = await UserTaskService.createTask(req.user!.userId, req.body.title);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Gets all tasks for a user
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The tasks
 */
userTaskRouter.get("/", async (req, res, next) => {
  try {
    const tasks = await UserTaskService.getTasks(req.user!.userId);
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
 * Gets a task by ID
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The task
 */
userTaskRouter.get("/:id", async (req, res, next) => {
  try {
    const task = await UserTaskService.getTaskById(req.user!.userId, req.params.id);
    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Updates a task by ID
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The updated task
 */
userTaskRouter.patch("/:id", async (req, res, next) => {
  try {
    const task = await UserTaskService.updateTask(req.user!.userId, req.params.id, req.body.title);
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Deletes a task by ID
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The deleted task
 */
userTaskRouter.delete("/:id", async (req, res, next) => {
  try {
    await UserTaskService.deleteTask(req.user!.userId, req.params.id);
    res.status(200).json({
      success: true,
      message: "Task deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
});