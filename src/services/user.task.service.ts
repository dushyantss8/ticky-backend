import { Task } from "../types/task";
import { AppError } from "../errors/AppError";
import { UserTaskRepository } from "../repositories/user.task.repository";

/**
 * Validates the title of a task
 * @param title - The title of the task
 * @returns The validated title
 */
const validateTitle = (title: unknown): string => {
  if (typeof title !== "string" || title.trim() === "") {
    throw new AppError(400, "Title is required");
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length > 100) {
    throw new AppError(400, "Title must be 100 char or less");
  }

  return trimmedTitle;
}

/**
 * Creates a task for a user
 * @param userId - The ID of the user
 * @param title - The title of the task
 * @returns The created task
 */
const createTask = async (userId: string, title: string): Promise<Task> => {
  const validatedTitle = validateTitle(title);
  const task = await UserTaskRepository.saveTask(userId, validatedTitle);
  return task;
};

/**
 * Gets all tasks for a user
 * @param userId - The ID of the user
 * @returns The tasks
 */
const getTasks = async (userId: string): Promise<Task[]> => {
  const tasks = await UserTaskRepository.getTasksByUserId(userId);
  return tasks;
};

/**
 * Gets a task by ID
 * @param userId - The ID of the user
 * @param id - The ID of the task
 * @returns The task
 */
const getTaskById = async (userId: string, id: string): Promise<Task | null> => {
  const task = await UserTaskRepository.getTaskById(userId, id);
  if (!task) {
    throw new AppError(404, "Task not found");
  }
  return task;
};

/**
 * Updates a task by ID
 * @param userId - The ID of the user
 * @param id - The ID of the task
 * @param title - The title of the task
 * @returns The updated task
 */
const updateTask = async (userId: string, id: string, title: string): Promise<Task> => {
  const validatedTitle = validateTitle(title);
  const task = await UserTaskRepository.updateTask(userId, id, validatedTitle);
  if (!task) {
    throw new AppError(404, "Task not found");
  }
  return task;
};

/**
 * Deletes a task by ID
 * @param userId - The ID of the user
 * @param id - The ID of the task
 * @returns The deleted task
 */
const deleteTask = async (userId: string, id: string): Promise<void> => {
  const task = await UserTaskRepository.getTaskById(userId, id);
  if (!task) {
    throw new AppError(404, "Task not found");
  }
  await UserTaskRepository.deleteTask(userId, id);
};

export const UserTaskService = { createTask, getTasks, getTaskById, updateTask, deleteTask };