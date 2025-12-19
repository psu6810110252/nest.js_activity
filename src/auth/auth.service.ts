import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ตรวจสอบ Email และ Password
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /* สร้าง Token (Payload คือข้อมูลที่จะฝังใน Token) */
  async login(user: any) {
  const payload = { 
    email: user.email, 
    sub: user.id, 
    role: 'ADMIN' // กรณีทดสอบ ให้ตั้งค่า default เป็น 'USER'
    //
  };
  
  return {
    access_token: this.jwtService.sign(payload),
  };
}
// src/auth/auth.service.ts */


}