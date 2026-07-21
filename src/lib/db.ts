import { createPool } from "mysql2/promise";
import { env } from "../config/env";

const url = new URL(env.databaseUrl);

export const db = createPool({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),

  waitForConnections: true,
  connectionLimit: 10,
});