import { defineConfig } from "drizzle-kit";

const connectionString = process.env.PG!;

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle",
});
