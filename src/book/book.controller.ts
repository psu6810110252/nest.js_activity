// src/book/book.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

// 1. บังคับ Login ทุกฟังก์ชัน
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

  // 3. ทุกคน: อ่านทั้งหมด
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  // 4. ทุกคน: อ่านเล่มเดียว
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

  // 6. ADMIN เท่านั้น: ลบ (จุดสำคัญ!)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  // 7. ทุกคน: กดไลก์
  @Patch(':id/like')
  incrementLikes(@Param('id') id: string) {
    return this.bookService.incrementLikes(id);
  }
} 
// <-- ปีกกาปิด Class ต้องอยู่บรรทัดสุดท้ายสุดเท่านั้น!