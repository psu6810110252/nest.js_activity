import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BookCategory } from '../../book-category/entities/book-category.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: 0 })
  likeCount: number;

  // เชื่อมความสัมพันธ์ Many-to-One ไปที่ BookCategory
  @ManyToOne(() => BookCategory, { eager: true })
  category: BookCategory;

  @Column()
  categoryId: string; // เก็บ ID ของหมวดหมู่
}