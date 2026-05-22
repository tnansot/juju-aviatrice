CREATE TABLE `onboarding` (
	`device_id` text PRIMARY KEY NOT NULL,
	`etat` text DEFAULT 'non_demarre' NOT NULL,
	`etape_courante` integer,
	`premier_acces_psy_fait` integer DEFAULT false NOT NULL,
	`date_maj` integer NOT NULL,
	FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON UPDATE no action ON DELETE no action
);
