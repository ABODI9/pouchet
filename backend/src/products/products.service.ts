// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  // ✅ correct: use "order"
  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Product not found');
    return found;
  }

  create(dto: CreateProductDto) {
    const entity = this.repo.create({ ...dto });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    await this.repo.update({ id }, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete({ id });
    return { deleted: true };
  }
}
