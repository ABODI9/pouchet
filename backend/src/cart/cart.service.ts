import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartItem } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(@InjectRepository(CartItem) private repo: Repository<CartItem>) {}

  async create(dto: CreateCartDto) {
    const row = this.repo.create({
      userId: dto.userId ?? null,
      sessionId: dto.sessionId ?? null,
      productId: dto.productId,
      productName: dto.productName,
      productImage: dto.productImage ?? null,
      unitPrice: dto.unitPrice,
      quantity: dto.quantity,
      status: 'open',
      notes: dto.notes ?? null,
    });
    return this.repo.save(row);
  }

  async findAll(filter?: {
    userId?: string | null;
    sessionId?: string | null;
    status?: 'open' | 'checked_out' | 'abandoned';
  }) {
    const where: FindOptionsWhere<CartItem> = {};
    if (filter?.userId != null) where.userId = filter.userId;
    if (filter?.sessionId != null) where.sessionId = filter.sessionId;
    if (filter?.status) where.status = filter.status;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const it = await this.repo.findOne({ where: { id } });
    if (!it) throw new NotFoundException('Cart item not found');
    return it;
  }

  async update(id: string, dto: UpdateCartDto) {
    const row = await this.findOne(id);
    if (dto.quantity != null) row.quantity = dto.quantity;
    if (dto.status) row.status = dto.status;
    if (dto.notes !== undefined) row.notes = dto.notes ?? null;
    // يسمح بتعديل معلومات المنتج لو حبيت
    if (dto.productName !== undefined) row.productName = dto.productName;
    if (dto.productImage !== undefined)
      row.productImage = dto.productImage ?? null;
    if (dto.unitPrice !== undefined) row.unitPrice = dto.unitPrice;
    return this.repo.save(row);
  }

  async remove(id: string) {
    const row = await this.findOne(id);
    await this.repo.remove(row);
    return { ok: true };
  }

  // تفريغ عربة مستخدم/جلسة
  async clear(filter: { userId?: string | null; sessionId?: string | null }) {
    const rows = await this.findAll({ ...filter, status: 'open' });
    if (!rows.length) return { ok: true, cleared: 0 };
    await this.repo.remove(rows);
    return { ok: true, cleared: rows.length };
  }
}
