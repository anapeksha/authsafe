import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Prisma, User } from "@prisma/client";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}
  @Get("/all")
  async getManyUsers(
    @Query()
    query: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    },
  ) {
    return this.userService.users(query);
  }
  @Post("/create")
  @UseInterceptors(FileInterceptor("image"))
  async createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: Pick<User, "name" | "email" | "password">,
  ) {
    return this.userService.createUser({ file: file, ...dto });
  }
  @Get("/:id")
  async getUserById(@Param("id") id: string) {
    return this.userService.user({ id });
  }
}
