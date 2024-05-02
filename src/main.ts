import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api");
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({ credentials: true });
  app.use(helmet());
  await app.listen(process.env.PORT);
}
bootstrap();
