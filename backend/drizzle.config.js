import { defineConfig } from "drizzle-kit";
import dotEnv from "dotenv";
import path from "path";

dotEnv.config({
  path: path.join(__dirname, "../.env"),
});

export default defineConfig({
  schema: "./src/db/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
