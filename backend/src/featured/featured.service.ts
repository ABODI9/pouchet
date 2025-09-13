import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { Featured } from './entities/featured.entity';

@Injectable()
export class FeaturedService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Featured) private readonly repo: Repository<Featured>,
  ) {
    fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  findAll() {
    return this.repo.find({
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const it = await this.repo.findOne({ where: { id } });
    if (!it) throw new NotFoundException('Not found');
    return it;
  }

  async createMany(fileNames: string[], body: {
    order?: number;
    active?: string;
    productId?: string;
    caption?: string;
    openInNewTab?: string;
  }) {
    const base = Number(body.order ?? 0);
    const active = String(body.active ?? 'true') === 'true';
    const openInNewTab = body.openInNewTab != null ? String(body.openInNewTab) === 'true' : null;

    const rows = fileNames.map((fn, idx) =>
      this.repo.create({
        imageUrl: `/uploads/${fn}`,
        order: base + idx,
        active,
        productId: body.productId || null,
        caption: body.caption?.trim() || null,
        openInNewTab,
      }),
    );
    return this.repo.save(rows);
  }

  async updateOne(id: string, patch: {
    order?: number;
    active?: string;
    productId?: string;
    caption?: string;
    openInNewTab?: string;
    newFileName?: string; // عند رفع صورة جديدة
  }) {
    const row = await this.findOne(id);

    // لو في صورة جديدة: احذف القديمة من القرص
    if (patch.newFileName) {
      this.deletePhysicalFile(row.imageUrl);
      row.imageUrl = `/uploads/${patch.newFileName}`;
    }

    if (patch.order != null) row.order = Number(patch.order);
    if (patch.active != null) row.active = String(patch.active) === 'true';
    if (patch.productId !== undefined) row.productId = patch.productId || null;
    if (typeof patch.caption === 'string') row.caption = patch.caption.trim() || null;
    if (patch.openInNewTab != null) row.openInNewTab = String(patch.openInNewTab) === 'true';

    return this.repo.save(row);
  }

  async remove(id: string) {
    const row = await this.findOne(id);
    await this.repo.remove(row);
    this.deletePhysicalFile(row.imageUrl);
    return { ok: true };
  }

  deletePhysicalFile(imageUrl?: string) {
    if (!imageUrl) return;
    const abs = path.join(this.uploadDir, path.basename(imageUrl));
    if (fs.existsSync(abs)) fs.unlink(abs, () => {});
  }
}
