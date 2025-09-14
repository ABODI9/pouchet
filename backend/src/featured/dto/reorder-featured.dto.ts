import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class ReorderItemDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsInt()
  order!: number;
}

export class ReorderFeaturedDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items!: ReorderItemDto[];
}
