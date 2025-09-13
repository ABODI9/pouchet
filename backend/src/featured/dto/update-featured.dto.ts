import { PartialType } from '@nestjs/mapped-types';
import { CreateFeaturedDto } from './create-featured.dto';

export class UpdateFeaturedDto extends PartialType(CreateFeaturedDto) {}
