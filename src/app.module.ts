import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCategoryModule } from './book-category/book-category.module';
import { BookModule } from './book/book.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
      database: 'bookstore_dev',
      entities: [], // เราจะเพิ่ม Entities ที่นี่ในภายหลัง
      synchronize: true, // สร้าง Table อัตโนมัติ (ใช้สำหรับ Dev เท่านั้น)
      autoLoadEntities: true
    }),
    BookCategoryModule,
    BookModule,
    UsersModule,
    AuthModule,
  ],
})


@Module({
  imports: [
    // 1. Load ConfigModule ก่อน
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }), 

    // 2. ใช้ forRootAsync เพื่อรอให้ ConfigModule โหลดเสร็จก่อน
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],      // บอกว่า Module นี้ต้องใช้ ConfigModule
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'), // ใช้ ConfigService ดึงค่า แทน process.env
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],      // Inject ConfigService เข้ามาใน Factory
    }),
  ],
})

    

export class AppModule {}