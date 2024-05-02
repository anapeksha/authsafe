import { Controller, Get, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";

@Controller()
export class AppController {
  constructor() {}
  @Get("signin")
  async signin(@Req() req: Request, @Res() res: Response) {
    return res.render("signin", { title: "Signin" });
  }
  @Get("register")
  async register(@Req() req: Request, @Res() res: Response) {
    return res.render("register", { title: "Register" });
  }
}
