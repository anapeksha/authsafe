import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { NoFilesInterceptor } from "@nestjs/platform-express";
import { Prisma, User } from "@prisma/client";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}
  @Get("all")
  async getManyUsers(
    @Body()
    body: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    },
  ) {
    return this.userService.users(body);
  }
  @Post("create")
  @UseInterceptors(NoFilesInterceptor())
  async createUser(
    @Body() dto: Pick<User, "name" | "terms" | "email" | "password">,
  ) {
    console.log(dto);
    return this.userService.createUser(dto);
  }
  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return this.userService.user({ id });
  }
}
