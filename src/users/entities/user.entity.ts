import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Book } from '../../book/entities/book.entity'; // 👈 อย่าลืม import Book

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 👇 ความสัมพันธ์ Many-to-Many กับ Book
  @ManyToMany(() => Book, (book) => book.likedBy)
  @JoinTable() // 👈 ใส่ JoinTable ที่ฝั่ง User (หรือฝั่ง Book ก็ได้ ฝั่งใดฝั่งหนึ่ง)
  likedBooks: Book[];
}