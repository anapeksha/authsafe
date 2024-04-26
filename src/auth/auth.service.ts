import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { User } from "@prisma/client";
import * as argon2 from "argon2";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async signIn(body: Pick<User, "email" | "password">) {
    const { email, password } = body;
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
      const isMatched = await argon2.verify(user.password, password);
      if (isMatched) {
        const payload = { sub: user.id, email: user.email };
        const token = await this.jwt.signAsync(payload, {
          secret: "anapeksha",
        });
        return { token };
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      console.log(error);
      if (error.code === "P2025") {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
