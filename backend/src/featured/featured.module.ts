import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Featured } from './entities/featured.entity'; // ← عدّل المسار هنا
import { FeaturedService } from './featured.service';
import { FeaturedController } from './featured.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Featured])],
  controllers: [FeaturedController],
  providers: [FeaturedService],
  exports: [FeaturedService],
})
export class FeaturedModule {}
