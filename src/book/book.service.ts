import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  // ข้อ 2: findOne พร้อมดึงข้อมูล category
  // src/book/book.service.ts

async findOne(id: string) {
  return await this.bookRepository.findOne({
    where: { id },
    relations: ['category'], // <--- บรรทัดนี้คือคำสั่งให้ดึงข้อมูลที่เชื่อมโยงอยู่มาด้วย
  });
}
async findAll() {
  return await this.bookRepository.find({
    relations: ['category'],
  });
}

  // ข้อ 3: ฟังก์ชันเพิ่ม Like
  async incrementLikes(id: string) {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    book.likeCount = (book.likeCount ?? 0) + 1;
    return await this.bookRepository.save(book);
  }

  async remove(id: string) {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return await this.bookRepository.remove(book);
  }

  // ✅ เพิ่มใน src/book/book.service.ts

async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id); // เช็คว่ามีหนังสือไหม
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    
    // รวมข้อมูลเก่าและใหม่ แล้วบันทึก
    // หมายเหตุ: ต้องตรวจสอบว่า TypeORM เวอร์ชั่นที่ใช้รองรับการ spread object แบบนี้หรือไม่ 
    // ถ้าไม่ ให้ใช้ this.bookRepository.merge(book, updateBookDto) แทน
    const updatedBook = this.bookRepository.merge(book, updateBookDto as any); 
    return await this.bookRepository.save(updatedBook);
  }
} 
  // src/book/book.service.ts ✅