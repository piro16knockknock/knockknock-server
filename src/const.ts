import { config } from "dotenv";

config();

export const PORT = process.env.PORT ?? 5000;
export const DATABASE_URI = process.env.DATABASE_URI ?? "";
export const PRIVATEKEY = process.env.PRIVATEKEY ?? "adsjyt";

export const DB_HOST = process.env.DB_HOST ?? "";
export const DB_USER = process.env.DB_USER ?? "";
export const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
export const DB_DATABASE = process.env.DB_DATABASE ?? "";
