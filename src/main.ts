import markoPlugin from "@marko/express";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api");
  app.use(markoPlugin());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    session({
      secret: "anapeksha",
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.enableCors({ credentials: true });
  app.use(helmet());
  await app.listen(process.env.PORT);
}
bootstrap();
