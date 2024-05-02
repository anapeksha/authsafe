import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Omit<User, "password">> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      omit: { password: true },
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Omit<User, "password">[]> {
    const { skip, take, cursor, where, orderBy } = params;
    try {
      const user = await this.prisma.user.findMany({
        skip: Number(skip),
        take: Number(take),
        cursor,
        where,
        orderBy,
        omit: { password: true },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(
    unhashedData: Prisma.UserCreateInput,
  ): Promise<Omit<User, "password">> {
    try {
      const { terms, password, name, email } = unhashedData;
      const digest = await argon2.hash(password);
      const data = {
        image: "",
        name,
        email,
        terms: Boolean(terms),
        password: digest,
      };
      return this.prisma.user.create({
        data,
        omit: { password: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<Omit<User, "password">> {
    const { where, data } = params;
    try {
      return await this.prisma.user.update({
        data,
        where,
        omit: { password: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<Omit<User, "password">> {
    try {
      return await this.prisma.user.delete({
        where,
        omit: { password: true },
      });
    } catch (error) {
      throw error;
    }
  }
}
