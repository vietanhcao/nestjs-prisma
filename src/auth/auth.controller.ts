import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  // authController được tạo ra đồng thời cũng tạo ra authService
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: AuthDTO) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: AuthDTO) {
    return this.authService.login(body);
  }
}
