import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { Response } from "src/types";
import { omit } from "lodash";
import { User, UserProfile } from "@prisma/client";
interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

@Controller("auth")
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post("login")
  async login(@Body() reqBody: LoginRequest, @Res() response: Response) {
    const user = await this.authService.validateUser(
      reqBody.email,
      reqBody.password,
    );

    if (!user) {
      throw new HttpException(
        "Email or password is not correct!",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { token, expireDate } = await this.authService.createJwt(user.id);

    response
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expireDate,
        path: "/",
      })
      .send(omit(user, ["profile.password"]));
  }

  @Post("signup")
  async signUp(@Body() reqBody: SignUpRequest, @Res() response: Response) {
    const { email, name, password } = reqBody;

    const user = await this.usersService.findUser(email);

    if (user) {
      throw new HttpException(
        "User is already registred!",
        HttpStatus.CONFLICT,
      );
    }

    const userId = await this.usersService.createUser(email, name, password);
    const { token, expireDate } = await this.authService.createJwt(userId);

    response
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expireDate,
        path: "/",
      })
      .send({ userId });
  }
}
