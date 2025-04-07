ALTER TABLE `users` ADD `verification_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `verification_expires` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `verified` integer DEFAULT false;