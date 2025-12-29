import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',      // ตรงกับ docker-compose
      password: 'password123', // ตรงกับ docker-compose
      database: 'shop_db',    // ตรงกับ docker-compose
      autoLoadEntities: true,
      synchronize: true,      // Dev mode: แก้โค้ดแล้ว DB อัปเดตตาม
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}