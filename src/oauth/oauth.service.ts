import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Client, User } from "@prisma/client";
import { randomBytes } from "crypto";
import dayjs from "dayjs";
import {
  IssueGrantCodeDoneFunction,
  createServer,
  exchange,
  grant,
  type ExchangeDoneFunction,
} from "oauth2orize";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OAuthService {
  readonly server = createServer<Client, User>();
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {
    this.server.serializeClient((client, done) => {
      done(null, client.id);
    });
    this.server.deserializeClient(async (id, done) => {
      try {
        const client = await this.prisma.client.findUniqueOrThrow({
          where: {
            id,
          },
        });
        done(null, client);
      } catch (error) {
        done(error);
      }
    });
    this.server.grant(
      grant.code(
        async (
          client,
          redirectURI,
          user,
          issued: IssueGrantCodeDoneFunction,
        ) => {
          try {
            const authorizationCode = randomBytes(16).toString("hex");
            await this.prisma.authorizationCode.create({
              data: {
                clientId: client.id,
                userId: user.id,
                redirectURI: redirectURI,
                code: authorizationCode,
                expiresAt: dayjs(new Date()).add(10, "minutes").toDate(),
              },
            });
            issued(null, authorizationCode);
          } catch (error) {
            issued(error);
          }
        },
      ),
    );
    this.server.exchange(
      exchange.code(
        async (
          client,
          code: string,
          redirectURI: string,
          issued: ExchangeDoneFunction,
        ) => {
          try {
            await this.prisma.authorizationCode.findUniqueOrThrow({
              where: {
                code,
                clientId: client.id,
              },
            });
            if (client.redirectUris.includes(redirectURI)) {
              const payload = { sub: client.id };
              const accessToken = await this.jwt.signAsync(payload);
              const generatedRefreshToken = randomBytes(16).toString("base64");
              await this.prisma.refreshToken.create({
                data: {
                  clientId: client.id,
                  token: generatedRefreshToken,
                  expiresAt: dayjs(new Date()).add(7, "days").toDate(),
                },
              });
              issued(null, accessToken, generatedRefreshToken);
            }
          } catch (error) {
            issued(error);
          }
        },
      ),
    );
  }
}
