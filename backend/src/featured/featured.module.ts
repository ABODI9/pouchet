import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturedService } from './featured.service';
import { FeaturedController } from './featured.controller';
import { Featured } from './entities/featured.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Featured])],
  controllers: [FeaturedController],
  providers: [FeaturedService],
  exports: [TypeOrmModule],
})
export class FeaturedModule {}
