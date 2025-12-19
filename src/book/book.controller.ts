import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // src/book/book.controller.ts

  @UseGuards(AuthGuard('jwt'), RolesGuard) // เพิ่มด่านตรวจ Token และ Role
  @Roles(UserRole.ADMIN, UserRole.USER)                   // ระบุว่าต้องเป็น ADMIN เท่านั้น
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);     // ลบ (as any) ออก และตรวจสอบว่าใน Service มีฟังก์ชัน remove
  }

  @Get() // <--- ต้องมี Decorator นี้เพื่อให้เรียก GET /book ได้
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return (this.bookService as any).update(id, updateBookDto);
  }

  @Patch(':id/like')
incrementLikes(@Param('id') id: string) {
  return this.bookService.incrementLikes(id);
}

}
