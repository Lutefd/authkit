DO $$ BEGIN
 CREATE TYPE "role_enum" AS ENUM('ADMIN', 'USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project1_user" ADD COLUMN "role" "role_enum" 