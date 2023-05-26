import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { MyJwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(MyJwtGuard)
  @Get('me')
  me(@GetUser() user: User) {
    return user;
  }
}
