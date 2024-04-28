import {
  CanActivate,
  Injectable,
  UnauthorizedException,
  type ExecutionContext,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import dayjs from "dayjs";
import type { Request } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractTokenFromCookie(request);
    const refreshToken = this.extractTokenFromCookie(request);
    if (!accessToken) {
      const refreshTokenFromDb = await this.prisma.token.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      });
      if (dayjs(new Date(refreshTokenFromDb.expiresAt)).isBefore(new Date())) {
        throw new Error("REFRESH-TOKEN-EXPIRED");
      } else {
        throw new UnauthorizedException("ACCESS-TOKEN-REFRESH-REQUIRED");
      }
    } else {
      try {
        const payload = await this.jwt.verifyAsync(accessToken, {
          secret: this.config.get("secrets.jwt"),
        });
        request["user"] = payload;
        return true;
      } catch (error) {
        const { message, code } = error;
        if (code === "P2025") {
          throw new UnauthorizedException("REFRESH-TOKEN-DOES-NOT-EXIST");
        } else if (
          message === "REFRESH-TOKEN-EXPIRED" ||
          message === "ACCESS-TOKEN-REFRESH-REQUIRED"
        ) {
          throw new UnauthorizedException(message);
        } else {
          throw new UnauthorizedException("LOGIN-REQUIRED");
        }
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization.split(" ") ?? [];
    return type === "Bearer" ? token : null;
  }

  private extractTokenFromCookie(request: Request): string | null {
    const token = request.cookies["refresh-token"];
    return token ? token : null;
  }
}
