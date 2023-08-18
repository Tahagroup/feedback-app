-- CreateTable
CREATE TABLE "IssueWithCommentsAndVotesCount" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "IssueStatus" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "IssueType" NOT NULL,
    "published" BOOLEAN NOT NULL,
    "reviewed" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentsCount" INTEGER NOT NULL,
    "upVoteCount" INTEGER NOT NULL,
    "downVoteCount" INTEGER NOT NULL,
    "labels" INTEGER[],
    "userIds" INTEGER[]
);

-- CreateIndex
CREATE UNIQUE INDEX "IssueWithCommentsAndVotesCount_id_key" ON "IssueWithCommentsAndVotesCount"("id");
