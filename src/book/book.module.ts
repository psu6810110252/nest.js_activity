import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity'; // 👈 1. ต้องเพิ่มบรรทัดนี้ครับ

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, User]) // 👈 2. ใส่ User ตรงนี้ถูกต้องแล้วครับ
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}