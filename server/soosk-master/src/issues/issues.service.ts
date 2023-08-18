import { Injectable } from "@nestjs/common";
import { Issue, Prisma, Vote, VoteType } from "@prisma/client";
import { FilesService } from "src/files/files.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
  FullIssueFindManyArgs,
  IssueStatus,
  IssueType,
  SortBy,
  SortType,
} from "./issues.types";

function convertSortType(sortType: SortType): Prisma.SortOrder {
  switch (sortType) {
    case SortType.ASC:
      return "asc";
    case SortType.DESC:
      return "desc";
  }
}

function getOrderBy(
  sortBy: SortBy,
  sortType: SortType,
): FullIssueFindManyArgs["orderBy"] {
  switch (sortBy) {
    case SortBy.Date:
      return { date: convertSortType(sortType) };
    case SortBy.Votes:
      return { upVoteCount: convertSortType(sortType) };
  }
}

export type UpdateIssueFields = Partial<
  Pick<
    Issue,
    "published" | "reviewed" | "status" | "title" | "type" | "description"
  >
>;
export const GetIssuesLimit = 20;
@Injectable()
export class IssuesService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async addIssue(
    userId: number,
    title: string,
    description: string,
    type: IssueType,
    labelIds?: number[],
    fileIds?: number[],
  ) {
    if (labelIds) {
      const labels = await this.prisma.label.findMany({
        where: { OR: labelIds.map((id) => ({ id })) },
      });

      if (labelIds.length !== labels.length) {
        throw Error("Labels not found!");
      }
    }

    if (fileIds) {
      const files = await this.prisma.file.findMany({
        where: { OR: fileIds.map((id) => ({ id })) },
      });

      if (fileIds.length !== files.length) {
        throw Error("Files not found!");
      }
    }

    return this.prisma.issue.create({
      data: {
        title,
        description,
        type,
        published: false,
        reviewed: false,
        status: IssueStatus.Pending,
        labels: labelIds && { connect: labelIds.map((id) => ({ id })) },
        user: { connect: { id: userId } },
        date: new Date(),
        files: fileIds && { connect: fileIds.map((id) => ({ id })) },
      },
    });
  }

  async getIssue(issueId: number) {
    const issue = await this.prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!issue) throw Error("NotFound");
    return issue;
  }

  async vote(userId: number, issueId: number, type: VoteType) {
    const vote = await this.prisma.vote.findFirst({
      where: { issueId, userId },
    });

    if (vote) {
      if (vote.type == type) throw new Error("Already voted");
      else throw new Error("Can not create vote");
    } else {
      await this.prisma.vote.create({
        data: {
          issue: { connect: { id: issueId } },
          type,
          date: new Date(),
          user: { connect: { id: userId } },
        },
      });
    }
  }

  async updateVote(userId: number, issueId: number, type: VoteType) {
    const vote = await this.prisma.vote.findFirst({
      where: { issueId, userId },
    });

    if (vote) {
      if (vote.type == type) throw new Error("Already voted");
      else
        return this.prisma.vote.update({
          where: { id: vote.id },
          data: { type },
        });
    }

    throw new Error("Vote not found!");
  }

  async deleteVote(userId: number, issueId: number) {
    const vote = await this.prisma.vote.findFirst({
      where: { issueId, userId },
    });

    if (vote) {
      return this.prisma.vote.delete({
        where: { id: vote.id },
      });
    }

    throw new Error("Vote not found!");
  }

  async getIssues(
    type?: IssueType,
    status?: IssueStatus,
    sortBy: SortBy = SortBy.Date,
    sortType: SortType = SortType.DESC,
    offset = 0,
    limit = GetIssuesLimit,
    lableIds?: number[],
  ) {
    return this.prisma.issueWithCommentsAndVotesCount.findMany({
      where: {
        type,
        status,
      },
      orderBy: getOrderBy(sortBy, sortType),
      skip: offset,
      take: limit,
    });
  }

  getComments(issueId: number, offset = 0) {
    return this.prisma.comment.findMany({
      where: { issueId },
      skip: offset,
      take: GetIssuesLimit,
    });
  }

  addComment(userId: number, issueId: number, text: string) {
    return this.prisma.comment.create({
      data: {
        text,
        date: new Date(),
        issue: { connect: { id: issueId } },
        user: { connect: { id: userId } },
      },
    });
  }

  addLabels(userId: number, issueId: number, labelIds: number[]) {
    return this.prisma.issue.update({
      where: { id: issueId },
      data: { labels: { connect: labelIds.map((id) => ({ id })) } },
    });
  }

  async getVotes(issueIds: number[], userId: number) {
    const votesArray = await this.prisma.vote.findMany({
      where: { OR: issueIds.map((id) => ({ issueId: id })), userId },
    });
    const issuesVotesMap = new Map<number, Vote>();

    votesArray.forEach((vote) => {
      // const votes = issuesVotesMap.get(vote.issueId);
      issuesVotesMap.set(vote.issueId, vote);
    });
    return issuesVotesMap;
  }

  async updateIssue(id: number, partialIssue: UpdateIssueFields) {
    return this.prisma.issue.update({ where: { id }, data: partialIssue });
  }
}
