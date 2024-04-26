import {
  CanActivate,
  Injectable,
  UnauthorizedException,
  type ExecutionContext,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { type Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    } else {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.config.get("secrets.jwt"),
        });
        request["user"] = payload;
        return true;
      } catch {
        throw new UnauthorizedException();
      }
    }
  }

  private extractTokenFromCookie(request: Request): string | null {
    const token = request.signedCookies["token"];
    return token ? token : null;
  }
}
