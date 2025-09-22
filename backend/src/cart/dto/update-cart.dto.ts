import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  @IsIn(['open', 'checked_out', 'abandoned'])
  status?: 'open' | 'checked_out' | 'abandoned';
}
