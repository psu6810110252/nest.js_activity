// src/book/book.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common'; // 1. เพิ่ม Req
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

// 1. บังคับ Login ทุกฟังก์ชัน (ถ้าไม่มี Token เข้าไม่ได้เลย)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // 2. ADMIN เท่านั้น: สร้างหนังสือ
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  // 3. ทุกคน (ที่มี Token): อ่านทั้งหมด
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  // 4. ทุกคน (ที่มี Token): อ่านเล่มเดียว
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  // 5. ADMIN เท่านั้น: แก้ไข
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  // 6. ADMIN เท่านั้น: ลบ
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  // 7. ทุกคน (ที่มี Token): กด Like / Unlike
  // ไม่ต้องใส่ @Roles เพราะยอมให้ User ทั่วไปกดได้
  @Patch(':id/like')
  async toggleLike(@Param('id') id: string, @Req() req) { // 👈 ใช้ @Req แทน @CurrentUser
    // req.user มาจากการที่ AuthGuard แกะ Token ออกมา
    // ปกติเราจะ map ให้มี userId อยู่ข้างใน (ขึ้นอยู่กับ jwt.strategy.ts ของคุณ)
    
    // ถ้าใน jwt.strategy.ts return { userId: payload.sub, ... } ให้ใช้:
    return this.bookService.toggleLike(id, req.user.userId); 
    
    // 💡 หมายเหตุ: ถ้า Code พังตรงนี้ ให้ลองเปลี่ยนเป็น req.user.id หรือ req.user.email ดูครับ
  }
}