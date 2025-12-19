// src/book/book.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    // 🚨 จุดที่แก้ 1: ต้อง Inject BookRepository เข้ามาด้วย (ของเดิมหายไป)
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    // Inject UserRepository เพื่อใช้หาตัวคนกดไลก์
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findOne(id: string) {
    return await this.bookRepository.findOne({
      where: { id },
      relations: ['category', 'likedBy'], // ดึงมาทั้งหมวดหมู่และคนกดไลก์
    });
  }

  async findAll() {
    return await this.bookRepository.find({
      relations: ['category', 'likedBy'],
    });
  }

  // ❌ ลบ incrementLikes แบบเก่าออก เพื่อไม่ให้สับสน

  async remove(id: string) {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return await this.bookRepository.remove(book);
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    const updatedBook = this.bookRepository.merge(book, updateBookDto as any);
    return await this.bookRepository.save(updatedBook);
  }

  // ✅ ฟังก์ชัน Toggle Like (หัวใจสำคัญ)
  async toggleLike(bookId: string, userId: string) {
    // 1. หาหนังสือ (พร้อมคนที่เคยไลก์)
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['likedBy'],
    });

    if (!book) throw new NotFoundException('Book not found');

    // 2. หา User ที่กำลังกด
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // 3. เช็คว่า User คนนี้อยู่ในรายชื่อคนไลก์หรือยัง?
    const isLiked = book.likedBy.some((u) => u.id === userId);

    if (isLiked) {
      // 👎 ถ้าเคยไลก์แล้ว -> เอาออก (Unlike)
      book.likedBy = book.likedBy.filter((u) => u.id !== userId);
    } else {
      // 👍 ถ้ายังไม่เคย -> ใส่เพิ่ม (Like)
      book.likedBy.push(user);
    }

    // 4. บันทึก
    await this.bookRepository.save(book);

    return {
      message: isLiked ? 'Unliked' : 'Liked',
      likeCount: book.likedBy.length,
    };
  }
}