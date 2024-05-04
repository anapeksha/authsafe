import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ValidateDoneFunction } from "oauth2orize";
import { PrismaService } from "src/services/prisma.service";
import { OAuthController } from "../controllers/oauth.controller";
import { OAuthService } from "../services/oauth.service";

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
  constructor(
    private oauth: OAuthService,
    private prisma: PrismaService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        this.oauth.server.authorization(
          async (clientId, redirectUri, done: ValidateDoneFunction) => {
            const client = await this.prisma.client.findUnique({
              where: {
                id: clientId,
              },
            });
            done(null, client, redirectUri);
          },
        ),
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
