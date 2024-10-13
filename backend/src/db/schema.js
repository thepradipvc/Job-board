import {
  pgTable,
  serial,
  varchar
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
});


const SCHEMA = {
  users
}

export default SCHEMA;