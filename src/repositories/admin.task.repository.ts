import { RowDataPacket } from "mysql2";
import { AppError } from "../errors/AppError";
import { db } from "../lib/db";
import { Task } from "../types/task";

type TaskRow = Task & RowDataPacket;
type AdminTaskListFilters = {
  search?: string;
  status?: string;
};

/**
 * Finds tasks for all admin users
 * @param filters - The filters object
 * @returns The tasks
 */
const findTasks = async (filters: AdminTaskListFilters): Promise<Task[]> => {
  try {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.search) {
      conditions.push(`title LIKE ?`);
      values.push(`%${filters.search}%`);
    }

    if (filters.status) {
      conditions.push(`status = ?`);
      values.push(filters.status);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const [result] = await db.query<TaskRow[]>(
      `
      SELECT id, title, status, user_id, created_at, updated_at
      FROM support_tasks ${whereClause} ORDER BY created_at DESC
    `,
      values,
    );

    return result;
  } catch (error) {
    throw new AppError(500, "Failed to find tasks");
  }
};

/**
 * Updates a task status
 * @param id - The id of the task
 * @param status - The status of the task
 * @returns The task
 */
const updateTaskStatus = async (id: string, status: string): Promise<Task | null> => {
  const [result] = await db.query<TaskRow[]>(`
    UPDATE support_tasks SET status = ? WHERE id = ?
  `, [status, id]);

  const [rows] = await db.query<TaskRow[]>(
    "SELECT id, title, status, user_id, created_at, updated_at FROM support_tasks WHERE id = ?",
    [id],
  );

  return rows[0] ?? null;
};

export const AdminTaskRepository = {
  findTasks,
  updateTaskStatus,
};
