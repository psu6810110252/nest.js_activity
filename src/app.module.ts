import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCategoryModule } from './book-category/book-category.module';
import { BookModule } from './book/book.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Load ConfigModule globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Use async TypeOrm config so it can read from ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // this module depends on ConfigModule
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'admin',
        password: configService.get<string>('DB_PASSWORD') || 'password123',
        database: configService.get<string>('DB_DATABASE') || 'bookstore_dev',
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    // Application modules
    BookCategoryModule,
    BookModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}