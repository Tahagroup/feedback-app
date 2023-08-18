import { Id } from "src/types";
import { Prisma } from "@prisma/client";
export enum SortBy {
  Date = "Date",
  Votes = "Votes",
}

export enum SortType {
  ASC = "ASC",
  DESC = "DESC",
}

export type FullIssueFindManyArgs =
  Prisma.IssueWithCommentsAndVotesCountFindManyArgs;
export { IssueStatus, IssueType, VoteType } from "@prisma/client";
