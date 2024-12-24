import {
  IsOptional,
  IsArray,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QueryParamsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value)) // Convert CSV to array
  @ApiPropertyOptional({
    description: 'Fields to include, as a comma-separated string.',
    type: [String]
  })
  fields?: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Search query string.'
  })
  search?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Filter your query'
  })
  filter?: string;
  

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10)) // Convert to number
  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    minimum: 1,
    example: 1,
  })
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10)) // Convert to number
  @ApiPropertyOptional({
    description: 'Number of items per page.',
    minimum: 1,
    example: 10,
  })
  limit?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === undefined ? false : value === 'true' || value === true))
  @ApiPropertyOptional({
    description: 'Indicates whether to populate related data.',
    type: Boolean,
    example: true,
  })
  populate?: boolean;
}