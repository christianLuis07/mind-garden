-- AlterTable
ALTER TABLE `journal_entries` MODIFY `content` LONGTEXT NOT NULL;

-- CreateTable
CREATE TABLE `support_group_invitations` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `supportGroupId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `support_group_invitations_userId_supportGroupId_key`(`userId`, `supportGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `support_group_invitations` ADD CONSTRAINT `support_group_invitations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_group_invitations` ADD CONSTRAINT `support_group_invitations_supportGroupId_fkey` FOREIGN KEY (`supportGroupId`) REFERENCES `support_groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
