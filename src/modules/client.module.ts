import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { ClientController } from "../controllers/client.controller";
import { ClientService } from "../services/client.service";

@Module({
  providers: [ClientService, PrismaService],
  controllers: [ClientController],
})
export class ClientModule {}
