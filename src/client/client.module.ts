import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";

@Module({
  providers: [ClientService, PrismaService],
  controllers: [ClientController],
})
export class ClientModule {}
