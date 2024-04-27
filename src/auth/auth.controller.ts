import {
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import * as dayjs from "dayjs";
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
      const { accessToken, refreshToken } = await this.auth.issueToken(user);
      res
        .status(HttpStatus.OK)
        .cookie("refresh-token", refreshToken, {
          signed: false,
          expires: dayjs(new Date()).add(7, "days").toDate(),
          httpOnly: true,
          sameSite: "lax",
        })
        .json({ token: accessToken });
    } catch (error) {
      Logger.error(error);
      if (error.code === "P2025") {
        throw new NotFoundException();
      } else if (error.message === "UNAUTHORIZED") {
        throw new UnauthorizedException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
