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

  // src/auth/auth.controller.ts
@Post('login')
async login(@Body() body: any) {
  // 1. ตรวจสอบรหัสผ่านก่อน
    const user = await this.authService.validateUser(body.email, body.password);
  
  if (!user) {
    throw new UnauthorizedException(); // ถ้าผิด ให้แจ้ง Error
  }

  // 2. ถ้ารหัสถูก ค่อยสร้าง Token
  return this.authService.login(user);
}
}
