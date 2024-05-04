import { Module } from "@nestjs/common";
import { CloudinaryService } from "src/services/cloudinary.service";
import { PrismaService } from "src/services/prisma.service";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CloudinaryService],
})
export class UserModule {}
