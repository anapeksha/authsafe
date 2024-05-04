import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import config from "./config/constants.config";
import { AuthModule } from "./modules/auth.module";
import { ClientModule } from "./modules/client.module";
import { OAuthModule } from "./modules/oauth.module";
import { UserModule } from "./modules/user.module";

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
