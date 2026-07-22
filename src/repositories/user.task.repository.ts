import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../lib/db";
import { Task } from "../types/task";

/**
 * Saves a task to the database
 * @param userId - The ID of the user
 * @param title - The title of the task
 * @returns The saved task
 */
const saveTask = async (userId: string, title: string): Promise<Task> => {
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO support_tasks (user_id, title) VALUES (?, ?)",
    [userId, title],
  );

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, user_id, title, status, created_at, updated_at FROM support_tasks WHERE id = ?",
    [result.insertId],
  );

  return {
    id: rows[0]?.id.toString(),
    title: rows[0]?.title,
    status: rows[0]?.status,
    user_id: rows[0]?.user_id,
    created_at: rows[0]?.created_at,
    updated_at: rows[0]?.updated_at,
  };
};

/**
 * Gets all tasks for a user
 * @param userId - The ID of the user
 * @returns The tasks
 */
const getTasksByUserId = async (userId: string): Promise<Task[]> => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, user_id, title, status, created_at, updated_at FROM support_tasks WHERE user_id = ?",
    [userId],
  );

  return rows.map((row) => ({
    id: row.id.toString(),
    title: row.title,
    status: row.status,
    user_id: row.user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
};

/**
 * Gets a task by ID
 * @param userId - The ID of the user
 * @param id - The ID of the task
 * @returns The task
 */
const getTaskById = async (userId: string, id: string): Promise<Task | null> => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, user_id, title, status, created_at, updated_at FROM support_tasks WHERE id = ? AND user_id = ?",
    [id, userId],
  );

  return {
    id: rows[0]?.id.toString(),
    title: rows[0]?.title,
    status: rows[0]?.status,
    user_id: rows[0]?.user_id,
    created_at: rows[0]?.created_at,
    updated_at: rows[0]?.updated_at,
  };
};

/**
 * Updates a task by ID
 * @param userId - The ID of the user
 * @param id - The ID of the task
 * @param title - The title of the task
 * @returns The updated task
 */
const updateTask = async (userId: string, id: string, title: string): Promise<Task> => {
  const [result] = await db.query<ResultSetHeader>(
    "UPDATE support_tasks SET title = ?, updated_at = NOW() WHERE id = ? AND user_id = ?",
    [title, id, userId, new Date()],
  );

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, user_id, title, status, created_at, updated_at FROM support_tasks WHERE id = ? AND user_id = ?",
    [id, userId],
  );

  return {
    id: rows[0]?.id.toString(),
    title: rows[0]?.title,
    status: rows[0]?.status,
    user_id: rows[0]?.user_id,
    created_at: rows[0]?.created_at,
    updated_at: rows[0]?.updated_at,
  };
};

/**
 * Deletes a task by ID
 * @param userId - The ID of the user
 * @param id - The ID of the task
 * @returns The deleted task
 */
const deleteTask = async (userId: string, id: string): Promise<void> => {
  await db.query("DELETE FROM support_tasks WHERE id = ? AND user_id = ?", [id, userId]);
};

export const UserTaskRepository = {
  saveTask,
  getTasksByUserId,
  getTaskById,
  updateTask,
  deleteTask
};