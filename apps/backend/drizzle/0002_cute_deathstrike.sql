CREATE TYPE "public"."gender" AS ENUM('man', 'woman', 'nonbinary', 'other', 'prefer_not_to_say');--> statement-breakpoint
CREATE TYPE "public"."looking_for" AS ENUM('relationship', 'casual', 'friendship', 'unsure');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"bio" text,
	"photos" json DEFAULT '[]'::json NOT NULL,
	"gender" "gender",
	"dob" date,
	"location" varchar(255),
	"latitude" numeric(9, 6),
	"longitude" numeric(9, 6),
	"interests" json DEFAULT '[]'::json NOT NULL,
	"preferences" json DEFAULT '{}'::json NOT NULL,
	"looking_for" "looking_for",
	"height" integer,
	"occupation" varchar(255),
	"education" varchar(255),
	"completed" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_metadata" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;