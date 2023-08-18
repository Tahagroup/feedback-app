import {
  Get,
  Query,
  Req,
  Controller,
  Param,
  HttpException,
  HttpStatus,
  Patch,
  UseGuards,
  Body,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UpdateUserFields, UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("/:userId")
  async getUser(@Param("userId") userId: string) {
    return this.usersService
      .getUserById(Number(userId))
      .catch((error: Error) => {
        if (error.message === "NotFound") {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Patch(":userId")
  @UseGuards(AuthGuard("jwt"))
  async updateUser(
    @Param("userId") userId: string,
    @Body() reqBody: UpdateUserFields,
  ) {
    return this.usersService
      .updateUserInfo(Number(userId), reqBody)
      .catch((error: Error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
  }
}
