import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { User } from "@prisma/client";
import * as argon2 from "argon2";
import * as dayjs from "dayjs";
import { PrismaService } from "src/prisma/prisma.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async authenticateUser(body: Pick<User, "email" | "password">) {
    const { email, password } = body;
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
      const isMatched = await argon2.verify(user.password, password);
      if (isMatched) {
        return user;
      } else {
        throw new Error("UNAUTHORIZED");
      }
    } catch (error) {
      if (error.code === "P2015") {
        throw new Error("NOT-FOUND");
      } else {
        throw error;
      }
    }
  }
  async issueToken(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = { sub: user.id, email: user.email };
      const accessToken = await this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow("secrets.jwt"),
        expiresIn: "15m",
      });
      const refreshToken = uuidv4();
      await this.prisma.token.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: dayjs(new Date()).add(7, "days").toDate(),
        },
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
}
