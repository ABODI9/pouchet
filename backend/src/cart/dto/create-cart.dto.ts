import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateCartDto {
  @IsOptional() @IsString() userId?: string | null;
  @IsOptional() @IsString() sessionId?: string | null;

  @IsString() @IsNotEmpty() productId!: string;
  @IsString() @IsNotEmpty() productName!: string;

  @IsOptional() @IsString() productImage?: string | null;

  // numeric يُستقبل كنص
  @IsString() @IsNotEmpty() unitPrice!: string;

  @IsInt() @Min(1) quantity!: number;

  @IsOptional() @IsString() notes?: string | null;
}
