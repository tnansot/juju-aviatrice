DROP TABLE `invite_tokens`;
--> statement-breakpoint
CREATE TABLE `invite_tokens` (
	`token` text PRIMARY KEY NOT NULL,
	`max_utilisations` integer NOT NULL DEFAULT 3,
	`utilisations` integer NOT NULL DEFAULT 0,
	`created_at` integer NOT NULL
);
