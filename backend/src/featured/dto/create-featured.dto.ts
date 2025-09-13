import { IsBooleanString, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFeaturedDto {
  // سيتم تجاهل الصور هنا لأنها عبر multipart

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBooleanString()
  active?: string; // 'true' | 'false'

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsBooleanString()
  openInNewTab?: string; // 'true' | 'false'
}
