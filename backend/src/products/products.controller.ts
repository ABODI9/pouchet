// backend/src/products/products.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const fileFilter = (_req: any, file: Express.Multer.File, cb: Function) => {
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new BadRequestException('INVALID_TYPE'), false);
  }
  cb(null, true);
};

@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get()
  list() {
    return this.svc.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'uploads', // backend/uploads
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname || '');
          cb(null, `${unique}${ext}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
      fileFilter,
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    const { title, price, description } = body;
    if (!title || price === undefined) {
      throw new BadRequestException('title and price are required');
    }

    const base = `${req.protocol}://${req.get('host')}`; // مثال: http://localhost:3000
    const imageUrl = file
      ? `${base}/uploads/${file.filename}`
      : body.imageUrl || '';

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      throw new BadRequestException('price must be a number');
    }

    return this.svc.create({
      title,
      price: numericPrice,
      imageUrl,
      // @ts-ignore: allow extra props
      description: description ?? null,
    } as any);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.svc.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
