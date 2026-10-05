import { pgTable, integer, text, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const product = pgTable("product", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  description: text(),
});
