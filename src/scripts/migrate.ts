import path from "node:path";
import fs from "node:fs";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { db } from "../lib/db";
import { logger } from "../lib/logger";

const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

const CREATE_MIGRATIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS migrations (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_migrations_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

interface MigrationRow extends RowDataPacket {
  name: string;
}

interface LockRow extends RowDataPacket {
  acquired: number;
}

async function getExecutedMigrations(
  connection: PoolConnection,
): Promise<string[]> {
  const [rows] = await connection.query<MigrationRow[]>(
    "SELECT name FROM migrations ORDER BY name",
  );

  return rows.map((row) => row.name);
}

function getMigrationFiles(): string[] {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

async function runMigration(
  connection: PoolConnection,
  fileName: string,
): Promise<void> {
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, fileName), "utf-8");

  await connection.query(sql);
  await connection.execute("INSERT INTO migrations (name) VALUES (?)", [
    fileName,
  ]);

  logger.info({ migration: fileName }, "migration completed");
}

async function migrate(): Promise<void> {
  const connection = await db.getConnection();

  try {
    const [lockRows] = await connection.query<LockRow[]>(
      "SELECT GET_LOCK(?, 30) AS acquired",
      ["ticky_nodejs_migrations"],
    );

    if (lockRows[0]?.acquired !== 1) {
      throw new Error("Could not acquire the migration lock");
    }

    await connection.query(CREATE_MIGRATIONS_TABLE_SQL);

    const executed = new Set(await getExecutedMigrations(connection));
    const pending = getMigrationFiles().filter((file) => !executed.has(file));

    if (pending.length === 0) {
      logger.info("no pending migrations");
      return;
    }

    for (const fileName of pending) {
      await runMigration(connection, fileName);
    }

    logger.info("all migrations completed");
  } finally {
    await connection
      .query("SELECT RELEASE_LOCK(?)", ["ticky_nodejs_migrations"])
      .catch(() => undefined);
    connection.release();
  }
}

migrate()
  .catch((error) => {
    logger.error({ err: error }, "Migrations failed");
    process.exit(1);
  })
  .finally(() => db.end());
