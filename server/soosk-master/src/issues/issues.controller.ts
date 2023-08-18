import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";
import {
  GetIssuesLimit,
  IssuesService,
  UpdateIssueFields,
} from "./issues.service";
import {
  IssueStatus,
  IssueType,
  SortBy,
  SortType,
  VoteType,
} from "./issues.types";
import { Request } from "src/types";
import { getUserId } from "src/utils";
import { FilesService } from "src/files/files.service";
import { File, Issue } from "@prisma/client";
import { omit } from "lodash";
import { AuthService } from "src/auth/auth.service";
import { extractFromCookie } from "src/auth/jwt.strategy";

type IssueIdParam = { issueId: string };
interface CreateIssueRequest {
  title: string;
  description: string;
  type: IssueType;
  labelIds?: string[];
  fileIds?: string[];
}

interface VoteIssueRequest {
  type: VoteType;
}

interface CreateCommentRequest {
  text: string;
}

type UpdateIssueRequest = UpdateIssueFields;

interface AddLabelsToIssue {
  labelIds: string[];
}

type FilesResponse = Omit<File, "issueId" | "userId">;

@Controller("issues")
export class IssuesController {
  constructor(
    private issuesService: IssuesService,
    private filesService: FilesService,
    private authService: AuthService,
  ) {}

  @Get()
  async getIssues(
    @Req() req: Request,
    @Query("type") type?: IssueType,
    @Query("status") status?: IssueStatus,
    @Query("sortBy") sortBy?: SortBy,
    @Query("sortType") sortType?: SortType,
    @Query("offset") offset?: number,
    @Query("limit") limit?: number,
    @Query("labelIds") lableIds?: string,
  ) {
    const issues = await this.issuesService.getIssues(
      type,
      status,
      sortBy,
      sortType,
      Number(offset ?? 0),
      Number(limit ?? GetIssuesLimit),
      lableIds
        ?.substring(1, lableIds.length - 1)
        .split(",")
        .map((i) => parseInt(i)),
    );

    const token = extractFromCookie(req);
    if (!token) return issues;

    const payload = await this.authService.verify(token);
    if (!payload) return issues;
    const currentUserId = Number(payload.sub);

    const votesMap = await this.issuesService.getVotes(
      issues.map((issue) => issue.id),
      currentUserId,
    );
    return issues.map((issue) => {
      return {
        ...omit(issue, "userIds"),
        vote: votesMap.get(issue.id),
      };
    });
  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async createIssue(@Body() reqBody: CreateIssueRequest, @Req() req: Request) {
    const { title, description, type, labelIds, fileIds } = reqBody;
    const issue = await this.issuesService.addIssue(
      getUserId(req),
      title,
      description,
      type,
      labelIds?.map((id) => Number(id)),
      fileIds?.map((id) => Number(id)),
    );

    return {
      id: issue.id,
    };
  }

  @Get("/:issueId")
  getIssue(@Param("issueId") issueId: string) {
    return this.issuesService
      .getIssue(Number(issueId))
      .catch((error: Error) => {
        if (error.message === "NotFound") {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Post(":issueId/votes")
  @UseGuards(AuthGuard("jwt"))
  vote(
    @Param("issueId") issueId: string,
    @Body() reqBody: VoteIssueRequest,
    @Req() req: Request,
  ) {
    return this.issuesService
      .vote(getUserId(req), Number(issueId), reqBody.type)
      .catch((error: Error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Patch(":issueId/votes")
  @UseGuards(AuthGuard("jwt"))
  updateVote(
    @Param("issueId") issueId: string,
    @Body() reqBody: VoteIssueRequest,
    @Req() req: Request,
  ) {
    return this.issuesService
      .updateVote(getUserId(req), Number(issueId), reqBody.type)
      .catch((error: Error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Delete(":issueId/votes")
  @UseGuards(AuthGuard("jwt"))
  deleteVote(@Param("issueId") issueId: string, @Req() req: Request) {
    return this.issuesService
      .deleteVote(getUserId(req), Number(issueId))
      .catch((error: Error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Get(":issueId/comments")
  getComments(
    @Param("issueId") issueId: string,
    @Query("offset") offset?: string,
  ) {
    return this.issuesService.getComments(Number(issueId), Number(offset ?? 0));
  }

  @Post(":issueId/comments")
  @UseGuards(AuthGuard("jwt"))
  createComment(
    @Param("issueId") issueId: string,
    @Body() reqBody: CreateCommentRequest,
    @Req() req: Request,
  ) {
    return this.issuesService
      .addComment(getUserId(req), Number(issueId), reqBody.text)
      .then((comment) => comment.id);
  }

  @Post(":issueId/labels")
  @UseGuards(AuthGuard("jwt"))
  addLabels(
    @Param("issueId") issueId: string,
    @Body() reqBody: AddLabelsToIssue,
    @Req() req: Request,
  ) {
    return this.issuesService
      .addLabels(
        getUserId(req),
        Number(issueId),
        reqBody.labelIds.map((l) => Number(l)),
      )
      .then();
  }

  @Get(":issueId/files")
  getFiles(@Param("issueId") issueId: string): Promise<FilesResponse[]> {
    return this.filesService.getFiles(Number(issueId)).then((files) =>
      files.map((file) => {
        return {
          ...omit(file, ["userId", "issueId"]),
          path: this.filesService.getPath(file.id),
        };
      }),
    );
  }

  @Patch(":issueId")
  @UseGuards(AuthGuard("jwt"))
  updateIssue(
    @Param("issueId") issueId: string,
    @Body() reqBody: UpdateIssueRequest,
    @Req() req: Request,
  ) {
    return this.issuesService
      .updateIssue(Number(issueId), reqBody)
      .catch((error: Error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
  }
}
