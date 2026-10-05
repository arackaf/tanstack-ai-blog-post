import { defineConfig } from "drizzle-kit";

const connectionString = process.env.PG!;

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  out: "./src/drizzle",
});
