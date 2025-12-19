import { Injectable, OnModuleInit } from '@nestjs/common'; // 1. เพิ่ม OnModuleInit
import { InjectRepository } from '@nestjs/typeorm'; // 2. เพิ่ม InjectRepository
import { Repository } from 'typeorm'; // 3. เพิ่ม Repository
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit { // เพิ่ม implements
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async onModuleInit() {
    const adminEmail = 'admin@bookstore.com';
    const admin = await this.findOneByEmail(adminEmail);
    if (!admin) {
        console.log('Seeding Admin User...');
        // เรียกใช้ method create ภายในตัวเองเพื่อ hash password
        await this.create({
            email: adminEmail,
            password: 'adminpassword',
            role: UserRole.ADMIN // ตรวจสอบว่าใน DTO รองรับ role
        } as CreateUserDto);
    }
  }

  // src/users/users.service.ts

  async create(createUserDto: CreateUserDto) {
    const { password, role, ...userData } = createUserDto;
    
    // Hashing Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = this.userRepository.create({ 
      ...userData, 
      password: hashedPassword,
      role: (role as UserRole) // 👈👈 สำคัญมาก: ต้องใส่ Role กลับคืนเข้าไปด้วยครับ!
    });
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  // --- ลบส่วนที่ซ้ำซ้อนออก ---

  findAll() {
    return this.userRepository.find(); // ปรับให้ดึงข้อมูลจริง
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id: id as any });
  }
  
  async update(id: string, updateUserDto: UpdateUserDto) {
    // ถ้ามีการแก้รหัสผ่าน ต้อง Hash ใหม่ด้วย (Optional: ถ้าจะทำละเอียด)
    /* if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    } 
    */
    return this.userRepository.update(id, updateUserDto as any);
  }

  // เพิ่มฟังก์ชันลบข้อมูล
  async remove(id: string) {
    return this.userRepository.delete(id);
  }
  
  

}