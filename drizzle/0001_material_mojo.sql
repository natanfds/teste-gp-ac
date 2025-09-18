CREATE TABLE "closure_nodes" (
	"ancestor" uuid NOT NULL,
	"descendant" uuid NOT NULL,
	"depth" integer NOT NULL,
	CONSTRAINT "closure_nodes_ancestor_descendant_pk" PRIMARY KEY("ancestor","descendant")
);
--> statement-breakpoint
CREATE TABLE "user_nodes" (
	"user_id" uuid NOT NULL,
	"node_id" uuid NOT NULL,
	CONSTRAINT "user_nodes_user_id_node_id_pk" PRIMARY KEY("user_id","node_id")
);
--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "parent_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "closure_nodes" ADD CONSTRAINT "closure_nodes_ancestor_nodes_id_fk" FOREIGN KEY ("ancestor") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "closure_nodes" ADD CONSTRAINT "closure_nodes_descendant_nodes_id_fk" FOREIGN KEY ("descendant") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_nodes" ADD CONSTRAINT "user_nodes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_nodes" ADD CONSTRAINT "user_nodes_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ancestor" ON "closure_nodes" USING btree ("ancestor");--> statement-breakpoint
CREATE INDEX "idx_descendant" ON "closure_nodes" USING btree ("descendant");--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "user_nodes" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "nodes" DROP COLUMN "depth";