import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api", {
    exclude: [{ path: "/login", method: RequestMethod.GET }],
  });
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
