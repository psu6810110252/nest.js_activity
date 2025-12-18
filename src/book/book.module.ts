import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // เพิ่มการ Import นี้
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './entities/book.entity'; // เพิ่มการ Import Entity

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]) // เพิ่มบรรทัดนี้ครับ
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}