-- AlterTable
ALTER TABLE `journal_entries` ADD COLUMN `images` JSON NULL;

-- AlterTable
ALTER TABLE `support_group_messages` ADD COLUMN `imageUrl` VARCHAR(191) NULL;
