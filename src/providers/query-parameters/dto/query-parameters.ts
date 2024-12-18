import { IsOptional, IsArray, IsString, IsInt, Min, IsIn, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryParamsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value)) // Convert CSV to array
  fields?: string[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10)) // Convert to number
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10)) // Convert to number
  limit?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === undefined ? false : value === 'true' || value === true))
  populate?: boolean;
}
