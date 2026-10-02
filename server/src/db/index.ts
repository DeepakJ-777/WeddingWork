import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// If DATABASE_URL is not yet configured, provide a stubbed client to allow development server to boot
export const sql = connectionString ? neon(connectionString) : null;
export const db = sql ? drizzle(sql, { schema }) : null;

export function getDb() {
  if (!db) {
    throw new Error(
      "DATABASE_URL is not configured. Please set DATABASE_URL in your .env file to connect to Neon PostgreSQL."
    );
  }
  return db;
}
