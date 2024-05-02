import { Controller, Get, Post, Render, Req, Res } from "@nestjs/common";
import { OAuthService } from "./oauth.service";

interface TokenBody {
  code: string;
  clientId?: string;
  userId?: string;
  clientSecret?: string;
  redirectUri: string;
}

@Controller("oauth")
export class OAuthController {
  constructor(private oauth2: OAuthService) {}
  @Render("login")
  @Get("authorize")
  async authorize(@Res() res, @Req() req) {
    return {
      transactionId: req.oauth2.transactionID,
      user: req.user,
      client: req.oauth2.client,
    };
  }
  @Post("token")
  token() {
    return;
  }
  @Post("decision")
  decision() {
    return;
  }
}
