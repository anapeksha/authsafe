import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api", {
    exclude: [
      { path: "signin", method: RequestMethod.GET },
      { path: "/", method: RequestMethod.GET },
    ],
  });
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({ credentials: true });
  app.use(helmet());
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("hbs");
  await app.listen(process.env.PORT);
}
bootstrap();
