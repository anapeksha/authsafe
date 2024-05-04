import { Injectable } from "@nestjs/common";
import { Client, Prisma } from "@prisma/client";
import { randomBytes } from "crypto";
import { PrismaService } from "./prisma.service";

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async client(
    userWhereUniqueInput: Prisma.ClientWhereUniqueInput,
  ): Promise<Client> {
    return this.prisma.client.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async clients(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ClientWhereUniqueInput;
    where?: Prisma.ClientWhereInput;
    orderBy?: Prisma.ClientOrderByWithRelationInput;
  }): Promise<Client[]> {
    const { skip, take, cursor, where, orderBy } = params;
    try {
      const user = await this.prisma.client.findMany({
        skip: Number(skip),
        take: Number(take),
        cursor,
        where,
        orderBy,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createClient(
    userId: Prisma.ClientCreateArgs["data"]["userId"],
  ): Promise<Client> {
    try {
      const secret = randomBytes(16).toString("hex");
      return this.prisma.client.create({
        data: {
          userId,
          secret,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateClient(params: {
    where: Prisma.ClientWhereUniqueInput;
    data: Prisma.ClientUpdateInput;
  }): Promise<Client> {
    const { where, data } = params;
    try {
      return await this.prisma.client.update({
        data,
        where,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteClient(where: Prisma.ClientWhereUniqueInput): Promise<Client> {
    try {
      return await this.prisma.client.delete({
        where,
      });
    } catch (error) {
      throw error;
    }
  }

  async generateSecret(where: Prisma.ClientWhereUniqueInput): Promise<string> {
    try {
      const secret = randomBytes(16).toString("hex");
      await this.prisma.client.update({
        data: {
          secret,
        },
        where,
      });
      return secret;
    } catch (error) {
      throw error;
    }
  }
}
