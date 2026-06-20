import { pgTable, uuid, timestamp, boolean, json, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", {length:255}).primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userMetadata = pgTable("user_metadata", {
    userId: varchar("user_id", {length:255}).primaryKey(),
    lastActive: timestamp("last_active").defaultNow().notNull(),
    isOnline: boolean("is_online").default(false).notNull(),
    deviceInfo: json("device_info").default({}).notNull(),
});