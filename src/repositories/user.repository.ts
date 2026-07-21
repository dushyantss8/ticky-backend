import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../lib/db";
import { DBUserRow, DBUserWithPasswordRow } from "../types/user";

/**
 * Finds a user by their email address
 * @param email - The email of the user to find
 * @returns The user if found, otherwise null
 */
const findUserByEmail = async (email: string): Promise<DBUserRow | null> => {
  const [rows] = await db.query<(DBUserRow & RowDataPacket)[]>(
    "SELECT id, email, role, created_at FROM users WHERE email = ?",
    [email],
  );

  return rows[0] ?? null;
};

/**
 * Creates a new user
 * @param email - The email of the user to create
 * @param passwordHash - The hashed password of the user
 * @returns The created user
 */
const createUser = async (
  email: string,
  passwordHash: string,
): Promise<DBUserRow> => {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO users (email, password_hash)
     VALUES (?, ?)`,
    [email, passwordHash],
  );

  const [rows] = await db.query<(DBUserRow & RowDataPacket)[]>(
    "SELECT id, email, role, created_at FROM users WHERE id = ?",
    [result.insertId],
  );

  const created = rows[0];
  if (!created) {
    throw new Error("Failed to load user after insert");
  }

  return created;
};

/**
 * Finds a user by their email address with their password
 * @param email - The email of the user to find
 * @returns The user if found, otherwise null
 */
const findUserByEmailWithPassword = async (
  email: string,
): Promise<DBUserWithPasswordRow | null> => {
  const [rows] = await db.query<(DBUserWithPasswordRow & RowDataPacket)[]>(
    "SELECT id, email, role, created_at, password_hash FROM users WHERE email = ?",
    [email],
  );

  return rows[0] ?? null;
};

export const UserRepository = {
  findUserByEmail,
  createUser,
  findUserByEmailWithPassword,
};
