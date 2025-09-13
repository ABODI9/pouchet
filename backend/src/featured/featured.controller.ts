import {
  Controller, Get, Post, Put, Delete, Param, Body,
  UploadedFiles, UploadedFile, UseInterceptors, BadRequestException
} from '@nestjs/common';
  // ملاحظة: إذا لم تكن مثبت @nestjs/platform-express فقم بتثبيته
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FeaturedService } from './featured.service';
import { CreateFeaturedDto } from './dto/create-featured.dto';
import { UpdateFeaturedDto } from './dto/update-featured.dto';

const uploadDir = path.join(process.cwd(), 'uploads');

const storage = diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  file.mimetype?.startsWith('image/')
    ? cb(null, true)
    : cb(new BadRequestException('Only images allowed'), false);
};
const limits = { fileSize: 2 * 1024 * 1024 }; // 2MB

@Controller('featured') // => /api/featured
export class FeaturedController {
  constructor(private readonly svc: FeaturedService) {}

  @Get()
  list() {
    return this.svc.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  // رفع عدّة صور في طلب واحد — field name: images
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, { storage, fileFilter, limits }))
  async createMany(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateFeaturedDto,
  ) {
    if (!files?.length) throw new BadRequestException('No images uploaded');
    const names = files.map(f => f.filename);
    return this.svc.createMany(names, body);
  }

  // تعديل عنصر واحد — صورة اختيارية — field name: image
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage, fileFilter, limits }))
  async updateOne(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: UpdateFeaturedDto,
  ) {
    return this.svc.updateOne(id, {
      order: body.order,
      active: body.active,
      productId: body.productId,
      caption: body.caption,
      openInNewTab: body.openInNewTab,
      newFileName: file?.filename,
    });
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
