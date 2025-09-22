import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart') // => /api/cart بعد setGlobalPrefix('api')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  // أمثلة لاستخدام الفلاتر: /api/cart?userId=U1&status=open
  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('status') status?: 'open' | 'checked_out' | 'abandoned',
  ) {
    return this.cartService.findAll({
      userId: userId ?? undefined,
      sessionId: sessionId ?? undefined,
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.cartService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.cartService.remove(id);
  }

  @Delete()
  clear(
    @Query('userId') userId?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.clear({
      userId: userId ?? null,
      sessionId: sessionId ?? null,
    });
  }
}
