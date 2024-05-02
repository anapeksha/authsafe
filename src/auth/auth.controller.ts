import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import dayjs from "dayjs";
import type { Response } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private auth: AuthService,
    private config: ConfigService,
  ) {}

  @Post("signin")
  async signIn(
    @Body() dto: Pick<User, "email" | "password">,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.auth.authenticateUser(dto);
      const { accessToken, refreshToken } = await this.auth.issueTokens(user);
      res
        .status(HttpStatus.OK)
        .cookie("refresh-token", refreshToken, {
          signed: true,
          expires: dayjs(new Date()).add(7, "days").toDate(),
          httpOnly: true,
          sameSite: "none",
        })
        .json({ token: accessToken });
    } catch (error) {
      const { message } = error;
      if (message === "NOT-FOUND") {
        throw new NotFoundException("email not matched");
      } else if (message === "UNAUTHORIZED") {
        throw new UnauthorizedException("password not matched");
      } else if (message === "NOT-EMAIL") {
        throw new BadRequestException("not an email");
      } else if (message === "EMPTY-PASSWORD") {
        throw new BadRequestException("empty password");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
