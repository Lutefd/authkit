DO $$ BEGIN
 CREATE TYPE "user_status_enum" AS ENUM('ACTIVE', 'BLOCKED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project1_user" ADD COLUMN "status" "user_status_enum";