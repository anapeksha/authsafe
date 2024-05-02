import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { OAuthController } from "./oauth.controller";
import { OAuthService } from "./oauth.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "30min",
      },
    }),
  ],
  providers: [OAuthService, PrismaService],
  controllers: [OAuthController],
})
export class OAuthModule {
  constructor(private oauth: OAuthService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        this.oauth.server.authorization((clientId, redirectUri, done) => {
          console.log(clientId, redirectUri, done);
        }),
      )
      .forRoutes({ path: "/oauth/authorize", method: RequestMethod.GET });
    consumer
      .apply(
        (req, res, next) => {
          next(false);
        },
        this.oauth.server.token(),
        this.oauth.server.errorHandler(),
      )
      .forRoutes({
        path: "/oauth/token",
        method: RequestMethod.POST,
      });
  }
}
