import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import * as argon2 from "argon2";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

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
    return this.prisma.user.findMany({
      skip: Number(skip),
      take: Number(take),
      cursor,
      where,
      orderBy,
      omit: { password: true },
    });
  }

  async createUser(
    unhashedData: Prisma.UserCreateInput & { file: Express.Multer.File },
  ): Promise<Omit<User, "password">> {
    try {
      const { file, password, name, email } = unhashedData;
      console.log("unhashed data", unhashedData);
      const digest = await argon2.hash(password);
      const imageUrl = await this.cloudinary.uploader(file);
      const data = {
        image: imageUrl,
        name: name,
        email: email,
        password: digest,
      };
      console.log("processed data", data);
      return this.prisma.user.create({
        data,
        omit: { password: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
    }
  }
}
