import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"

dotenv.config()

export const AppDataSource = new DataSource({
    type: (process.env.DB_TYPE === "postgres" ? "postgres" : "sqlite") as any,
    database: process.env.DB_NAME || "database.sqlite",
    url: process.env.DATABASE_URL,
    synchronize: process.env.DB_SYNC === "true" || process.env.NODE_ENV === "development",
    logging: process.env.DB_LOG === "true" || process.env.NODE_ENV === "development",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    entities: [__dirname + "/../entities/*.ts"],
    migrations: [],
    subscribers: [],
} as any)
