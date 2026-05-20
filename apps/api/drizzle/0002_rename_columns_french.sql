ALTER TABLE `devices` RENAME COLUMN `created_at` TO `date_creation`;
--> statement-breakpoint
ALTER TABLE `devices` RENAME COLUMN `last_seen_at` TO `derniere_activite`;
--> statement-breakpoint
ALTER TABLE `invite_tokens` RENAME COLUMN `created_at` TO `date_creation`;
