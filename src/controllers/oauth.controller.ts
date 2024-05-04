import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { OAuthService } from "../services/oauth.service";

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
  @Get("authorize")
  async authorize(@Res() res, @Req() req) {
    console.log({
      transactionId: req.oauth2.transactionID,
      user: req.user,
      client: req.oauth2.client,
    });
  }
  @Post("token")
  token() {
    this.oauth2.server.token();
    this.oauth2.server.errorHandler();
  }
  @Post("decision")
  decision() {
    this.oauth2.server.decision();
  }
}
