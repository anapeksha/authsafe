import { Body, Controller, Post } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("signin")
  async signIn(@Body() dto: Pick<User, "email" | "password">) {
    return this.auth.signIn(dto);
  }
}
