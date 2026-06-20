import { pgTable, uuid, timestamp, boolean, json, varchar, pgEnum, text, integer, numeric, date } from "drizzle-orm/pg-core";

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

export const lookingForEnum = pgEnum('looking_for', [
  'relationship',
  'casual',
  'friendship',
  'unsure',
]);

export const genderEnum = pgEnum('gender', [
  'man',
  'woman',
  'nonbinary',
  'other',
  'prefer_not_to_say',
]);

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),

  bio: text('bio'),
  photos: json('photos').$type<string[]>().default([]).notNull(),
  gender: genderEnum('gender'),
  dob: date('dob'),
  location: varchar('location', { length: 255 }),
  latitude: numeric('latitude', { precision: 9, scale: 6 }),
  longitude: numeric('longitude', { precision: 9, scale: 6 }),
  interests: json('interests').$type<string[]>().default([]).notNull(),
  preferences: json('preferences').$type<Record<string, unknown>>().default({}).notNull(),
  lookingFor: lookingForEnum('looking_for'),
  height: integer('height'),
  occupation: varchar('occupation', { length: 255 }),
  education: varchar('education', { length: 255 }),

  completed: boolean('completed').default(false).notNull(),
  deletedAt: timestamp('deleted_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});