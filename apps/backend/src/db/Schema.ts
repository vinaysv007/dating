import { pgTable, uuid, timestamp, boolean, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userMetadata = pgTable("user_metadata", {
    userId: uuid("user_id").primaryKey(),
    lastActive: timestamp("last_active").defaultNow().notNull(),
    isOnline: boolean("is_online").default(false).notNull(),
    deviceInfo: json("device_info").default({}).notNull(),
});