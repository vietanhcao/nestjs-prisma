import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  // authController được tạo ra đồng thời cũng tạo ra authService
  constructor(private authService: AuthService) {}
}
