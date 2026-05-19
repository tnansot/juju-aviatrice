CREATE TABLE `devices` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text,
	`created_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invite_tokens` (
	`token` text PRIMARY KEY NOT NULL,
	`used_by_device_id` text,
	`created_at` integer NOT NULL,
	`used_at` integer,
	FOREIGN KEY (`used_by_device_id`) REFERENCES `devices`(`id`) ON UPDATE no action ON DELETE no action
);
