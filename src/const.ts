import { config } from "dotenv";

config();

export const PORT = process.env.PORT ?? 5000;
export const DATABASE_URI = process.env.DATABASE_URI ?? "";
export const SALTROUNDS = process.env.SALTROUNDS ?? "11";
export const PRIVATEKEY = process.env.PRIVATEKEY ?? "adsjyt";
