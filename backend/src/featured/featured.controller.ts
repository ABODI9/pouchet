// backend/src/featured/featured.controller.ts
import {
  Controller, Get, Post, Put, Delete, Param, Body,
  UploadedFiles, UploadedFile, UseInterceptors, BadRequestException, Req, ParseUUIDPipe
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

import { FeaturedService } from './featured.service';
import { CreateFeaturedDto } from './dto/create-featured.dto';
import { UpdateFeaturedDto } from './dto/update-featured.dto';
import { ReorderFeaturedDto } from './dto/reorder-featured.dto';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const ALLOWED_EXT  = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const limits = { fileSize: 2 * 1024 * 1024 };

const storage = diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const okMime = ALLOWED_MIME.has(file.mimetype);
  const okExt  = ALLOWED_EXT.has(ext);
  if (okMime && okExt) return cb(null, true);
  return cb(new Error('Only JPG, PNG, WebP, AVIF are allowed (≤2MB)'), false);
};

function abs(req: Request, url?: string | null) {
  if (!url) return url ?? null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}${url.startsWith('/') ? url : '/' + url}`;
}

@Controller('featured')
export class FeaturedController {
  constructor(private readonly svc: FeaturedService) {}

  @Get()
  async list(@Req() req: Request) {
    const rows = await this.svc.findAll();
    return rows.map(r => ({ ...r, imageUrl: abs(req, r.imageUrl) }));
  }

  @Get(':id')
  async getOne(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    const r = await this.svc.findOne(id);
    return { ...r, imageUrl: abs(req, r.imageUrl) };
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor(
    [{ name: 'images', maxCount: 10 }, { name: 'image', maxCount: 10 }],
    { storage, fileFilter, limits }
  ))
  async createMany(
    @Req() req: Request,
    @UploadedFiles() files: { images?: Express.Multer.File[]; image?: Express.Multer.File[] },
    @Body() body: CreateFeaturedDto,
  ) {
    const arr = [...(files?.images ?? []), ...(files?.image ?? [])];
    if (!arr.length) throw new BadRequestException('No images uploaded');
    const names = arr.map(f => f.filename);
    const created = await this.svc.createMany(names, body);
    return created.map(r => ({ ...r, imageUrl: abs(req, r.imageUrl) }));
  }

  /** ضع مسار إعادة الترتيب قبل :id */
  @Put('reorder')
  async reorder(@Body() body: ReorderFeaturedDto) {
    return this.svc.reorder(body.items);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage, fileFilter, limits }))
  async updateOne(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: UpdateFeaturedDto,
  ) {
    const r = await this.svc.updateOne(id, { ...body, newFileName: file?.filename });
    return { ...r, imageUrl: abs(req, r.imageUrl) };
  }

  @Delete(':id')
  deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.svc.remove(id);
  }
}
