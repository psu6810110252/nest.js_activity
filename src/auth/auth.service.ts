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

  // สร้าง Token (Payload คือข้อมูลที่จะฝังใน Token)
 async login(email: string, pass: string) {
  // 1. ค้นหา User จาก Email
  const user = await this.usersService.findOneByEmail(email);
  if (!user) throw new UnauthorizedException('ไม่พบผู้ใช้งานนี้');

  // 2. เปรียบเทียบรหัสผ่านที่ส่งมา กับ Hash ใน Database
  const isMatch = await bcrypt.compare(pass, user.password); //
  if (!isMatch) throw new UnauthorizedException('รหัสผ่านไม่ถูกต้อง');

  // 3. สร้าง Token (ตัวอย่าง)
  const payload = { sub: user.id, username: user.email, role: user.role };
  return {
    access_token: await this.jwtService.signAsync(payload),
  };
}
}
