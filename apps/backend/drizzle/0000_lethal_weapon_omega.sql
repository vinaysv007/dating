CREATE TABLE "user_metadata" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"last_active" timestamp DEFAULT now() NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"device_info" json DEFAULT '{}'::json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
