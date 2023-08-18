-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_issueId_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "issueId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
