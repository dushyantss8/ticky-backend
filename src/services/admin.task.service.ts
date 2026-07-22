import { Task } from "../types/task";
import { AppError } from "../errors/AppError";
import { AdminTaskRepository } from "../repositories/admin.task.repository";

type AdminTaskListQuery = {
  search?: string;
  status?: string;
};

type AdminTaskListResponse = {
  tasks: Task[];
};

const TASK_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

type TaskStatus = (typeof TASK_STATUSES)[number];

/**
 * Gets all tasks for all admin user
 * @param query - The query object
 * @returns The tasks
 */
const getAdminTasks = async (query: AdminTaskListQuery): Promise<AdminTaskListResponse> => {
  try {
    const search = query.search?.trim() || undefined;
    const status = query.status?.trim() || undefined;

    if (status && !TASK_STATUSES.includes(status as TaskStatus)) {
      throw new AppError(
        400,
        `status must be between ${TASK_STATUSES.join(", ")}`,
      );
    }

    const tasks = await AdminTaskRepository.findTasks({
      search,
      status,
    });

    return { tasks };
  } catch (error) {
    throw new AppError(500, "Failed to get admin tasks");
  }
};

/**
 * Updates a task
 * @param id - The id of the task
 * @param status - The status of the task
 * @returns The task
 */
const updateTask = async (id: string, status: unknown): Promise<Task> => {
  if (typeof status !== "string" || !TASK_STATUSES.includes(status as TaskStatus)) {
    throw new AppError(
      400,
      `status must be between ${TASK_STATUSES.join(", ")}`,
    );
  }

  const task = await AdminTaskRepository.updateTaskStatus(id, status);

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  return task;
};

export const AdminTaskService = {
  getAdminTasks,
  updateTask,
};