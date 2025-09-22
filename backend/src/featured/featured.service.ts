import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateFeaturedDto } from './dto/create-featured.dto';
import { UpdateFeaturedDto } from './dto/update-featured.dto';
import { Featured } from './entities/featured.entity';

@Injectable()
export class FeaturedService {
  constructor(@InjectRepository(Featured) private repo: Repository<Featured>) {}

  private toPublicUrl(fileName: string) {
    return `/uploads/${fileName}`;
  }

  findAll() {
    return this.repo.find({ order: { order: 'ASC', createdAt: 'ASC' } });
  }

  async findOne(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Not found');
    return row;
  }

  async createMany(fileNames: string[], body: CreateFeaturedDto) {
    const baseOrder = body.order ?? Date.now();
    const rows = fileNames.map((fn, i) =>
      this.repo.create({
        imageUrl: this.toPublicUrl(fn),
        order: baseOrder + i,
        active: body.active ?? true,
        productId: body.productId ?? null,
        caption: body.caption ?? null,
        openInNewTab: body.openInNewTab ?? null,
      }),
    );
    return this.repo.save(rows);
  }

  async updateOne(id: string, body: UpdateFeaturedDto) {
    const row = await this.findOne(id);
    if (body.order != null) row.order = body.order;
    if (body.active != null) row.active = body.active;
    if (body.productId !== undefined) row.productId = body.productId ?? null;
    if (body.caption !== undefined) row.caption = body.caption ?? null;
    if (body.openInNewTab !== undefined)
      row.openInNewTab = body.openInNewTab ?? null;
    if (body.newFileName) row.imageUrl = this.toPublicUrl(body.newFileName);
    return this.repo.save(row);
  }

  async remove(id: string) {
    const row = await this.findOne(id);
    await this.repo.remove(row);
    return { ok: true };
  }

  async reorder(items: { id: string; order: number }[]) {
    if (!items?.length) return [];
    const ids = items.map((i) => i.id);
    const rows = await this.repo.find({ where: { id: In(ids) } });

    const map = new Map(items.map((i) => [i.id, i.order]));
    for (const r of rows) {
      const newOrder = map.get(r.id);
      if (typeof newOrder === 'number') r.order = newOrder;
    }
    return this.repo.save(rows);
  }
}
