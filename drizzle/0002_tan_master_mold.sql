DROP TABLE "groups" CASCADE;--> statement-breakpoint
ALTER TABLE "nodes" ADD COLUMN "parent_id" uuid;