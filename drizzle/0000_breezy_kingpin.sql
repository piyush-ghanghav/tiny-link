CREATE TABLE "Link" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"target_url" text NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_clicked_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "Link_code_unique" UNIQUE("code")
);
