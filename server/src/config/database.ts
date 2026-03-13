import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"

dotenv.config()

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE === "postgres" ? "postgres" : "sqlite",
    database: process.env.DB_NAME || "database.sqlite",
    // Connection string for postgres if needed
    url: process.env.DATABASE_URL,
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: [__dirname + "/../entities/*.ts"],
    migrations: [],
    subscribers: [],
})
