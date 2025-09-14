import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

function toBool(v: any): boolean {
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase();
  return s === 'true' || s === '1' || s === 'on' || s === 'yes';
}

export class CreateFeaturedDto {
  @IsOptional()
  @Type(() => Number)            // يحوّل "100" => 100
  @IsInt()
  order?: number;

  @IsOptional()
  @Transform(({ value }) => toBool(value)) // "true"/"1"/"on" => true
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  productId?: string | null;

  @IsOptional()
  @IsString()
  caption?: string | null;

  @IsOptional()
  @Transform(({ value }) => toBool(value))
  @IsBoolean()
  openInNewTab?: boolean | null;
}
