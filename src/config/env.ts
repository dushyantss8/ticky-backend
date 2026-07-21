import dotenv from "dotenv";

dotenv.config();

function checkRequiredEnvVariables(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing env variables for ${key}`);
    }

    return value;
}

export const env = {
    port: Number(process.env.PORT ?? 5010),
    isProduction: (process.env.NODE_ENV ?? "development") === "production",
    nodeEnv: process.env.NODE_ENV ?? "development",
    logLevel: process.env.LOG_LEVEL ?? "info",
    databaseUrl: checkRequiredEnvVariables("DATABASE_URL"),
    jwtSecret: checkRequiredEnvVariables("JWT_SECRET"),
    jwtExpirationTime: checkRequiredEnvVariables("JWT_EXPIRATION_TIME"),
} as const;