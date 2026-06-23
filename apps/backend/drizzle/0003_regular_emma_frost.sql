CREATE TABLE "user_locations" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"location" varchar(255),
	"latitude" numeric(9, 6),
	"longitude" numeric(9, 6),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "latitude";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "longitude";