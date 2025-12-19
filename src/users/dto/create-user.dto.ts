import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  email: string;
  password: string; // <--- เพิ่มบรรทัดนี้เพื่อให้ Service รู้จักค่า password
  role?: string; 
}
