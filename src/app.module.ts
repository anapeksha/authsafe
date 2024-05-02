import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { ClientModule } from "./client/client.module";
import config from "./config/constants.config";
import { OAuthModule } from "./oauth/oauth.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      serveRoot: "/",
      exclude: ["/api/(.*)"],
    }),
    OAuthModule,
    ClientModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
