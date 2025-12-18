import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { BookCategory } from './entities/book-category.entity';

@Injectable()
export class BookCategoryService {

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
        console.log('Seeding Book Categories...');
        await this.repo.save([
           { name: 'Fiction', description: 'Stories and novels' },
           { name: 'Technology', description: 'Computers and engineering' },
           { name: 'History', description: 'Past events' }
        ]);
    }
}

  constructor(
    @InjectRepository(BookCategory)
    private readonly repo: Repository<BookCategory>,
  ) {}

  async create(createBookCategoryDto: CreateBookCategoryDto) {
    const newCategory = this.repo.create(createBookCategoryDto);
    return await this.repo.save(newCategory);
  }

  async findAll() {
  try {
    return await this.repo.find();
  } catch (error) {
    console.error('Database Error:', error.message);
    throw error;
  }
}

  async findOne(id: string) {
    return await this.repo.findOneBy({ id });
  }

  async update(id: string, updateBookCategoryDto: UpdateBookCategoryDto) {
    await this.repo.update(id, updateBookCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    
    // เพิ่มการตรวจสอบตรงนี้ครับ
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }

    await this.repo.delete(id);
    return { message: `Book category with ID ${id} deleted successfully` };
  }
}