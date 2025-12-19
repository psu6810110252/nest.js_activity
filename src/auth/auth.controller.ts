import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

// สร้าง Class DTO สำหรับรับค่า (ใส่ในไฟล์เดียวกันหรือแยกไฟล์ก็ได้)
class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password); // Error เกิดขึ้นที่บรรทัดนี้
}
}
