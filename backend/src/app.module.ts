import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { FeaturedModule } from './featured/featured.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    // تحميل .env من مسارين (للعمل من src أو dist)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(__dirname, '..', '.env'),
        resolve(process.cwd(), '.env'),
      ],
    }),

    // تقديم ملفات الرفع (صور المنتجات)
    ServeStaticModule.forRoot({
        rootPath: join(process.cwd(), 'uploads'), // ✅ ثابت في dev/prod
        serveRoot: '/uploads',
      }),

    // قاعدة البيانات
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST') ?? 'localhost',
        port: Number(cfg.get('DB_PORT') ?? 5432),
        username: cfg.get<string>('DB_USERNAME') ?? 'postgres',
        password: cfg.get<string>('DB_PASSWORD') ?? 'postgres',
        database: cfg.get<string>('DB_DATABASE') ?? 'pouchet',
        autoLoadEntities: true,
        synchronize: true, // التطوير فقط
        logging: (cfg.get('NODE_ENV') ?? 'development') !== 'production',
      }),
    }),

    UsersModule,
    AuthModule,
    ProductsModule,
    FeaturedModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
