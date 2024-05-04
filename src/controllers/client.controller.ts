import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { isNotEmpty } from "class-validator";
import { ClientService } from "../services/client.service";

@Controller("client")
export class ClientController {
  constructor(private client: ClientService) {}
  @Get("all")
  async getManyUsers(
    @Body()
    body: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ClientWhereUniqueInput;
      where?: Prisma.ClientWhereInput;
      orderBy?: Prisma.ClientOrderByWithRelationInput;
    },
  ) {
    body.take = body.take || 20;
    return this.client.clients(body);
  }
  @Post("create")
  async createUser(@Body() body: { userId: string }) {
    if (isNotEmpty(body.userId)) {
      return await this.client.createClient(body.userId);
    } else {
      throw new BadRequestException("user id is empty");
    }
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    if (isNotEmpty(id)) {
      return this.client.client({ id });
    } else {
      throw new BadRequestException("id is empty");
    }
  }
}
