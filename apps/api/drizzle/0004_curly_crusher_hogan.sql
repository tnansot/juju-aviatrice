CREATE TABLE `exercices_en_cours` (
	`id` text PRIMARY KEY NOT NULL,
	`mini_session_id` text NOT NULL,
	`exercice_id` text NOT NULL,
	`reponse` text,
	`est_correct` integer,
	`duree_reponse_ms` integer,
	`etat` text DEFAULT 'en_attente' NOT NULL,
	`ordre` integer NOT NULL,
	`charge_a` integer NOT NULL,
	FOREIGN KEY (`mini_session_id`) REFERENCES `mini_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mini_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`chapitre_id` text NOT NULL,
	`format` text NOT NULL,
	`mode_chrono` integer DEFAULT false NOT NULL,
	`duree_chrono` integer,
	`etat` text DEFAULT 'en_cours' NOT NULL,
	`nombre_exercices_faits` integer DEFAULT 0 NOT NULL,
	`debut` integer NOT NULL,
	`fin` integer,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`device_id` text NOT NULL,
	`debut` integer NOT NULL,
	`fin` integer,
	`etat` text DEFAULT 'en_cours' NOT NULL,
	FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON UPDATE no action ON DELETE no action
);
