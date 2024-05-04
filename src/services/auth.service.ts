import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { User } from "@prisma/client";
import argon2 from "argon2";
import { isEmail, isEmpty } from "class-validator";
import { PrismaService } from "src/services/prisma.service";

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
      if (!isEmail(email)) {
        throw new Error("NOT-EMAIL");
      }
      if (isEmpty(password)) {
        throw new Error("EMPTY-PASSWORD");
      }
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
      const isMatched = await argon2.verify(user.password, password);
      if (isMatched) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new Error("UNAUTHORIZED");
      }
    } catch (error) {
      if (error.code === "P2025") {
        throw new Error("NOT-FOUND");
      } else {
        throw error;
      }
    }
  }
  async issueTokens(user: Omit<User, "password">) {
    try {
      const payload = { sub: user.id, email: user.email };
      const accessToken = await this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow("secrets.jwt"),
        expiresIn: "15m",
      });
      return { accessToken, refreshToken: "token" };
    } catch (error) {
      throw error;
    }
  }
}
