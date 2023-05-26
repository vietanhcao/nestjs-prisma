import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { MyJwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(MyJwtGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
