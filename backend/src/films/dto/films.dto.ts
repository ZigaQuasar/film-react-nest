import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

//TODO описать DTO для запросов к /films
export class FilmDto {
  @IsUUID()
  id: string;
  @IsNumber()
  @Min(0)
  rating: number;
  @IsString()
  director: string;
  @IsArray()
  @IsString({ each: true })
  tags: string[];
  @IsString()
  title: string;
  @IsString()
  about: string;
  @IsString()
  description: string;
  @IsString()
  image: string;
  @IsString()
  cover: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedule: ScheduleDto[];
}

export class ScheduleDto {
  @IsUUID()
  id: string;
  @IsString()
  daytime: string;
  @IsNumber()
  hall: number;
  @IsNumber()
  @Min(1)
  rows: number;
  @IsNumber()
  @Min(1)
  seats: number;
  @IsNumber()
  @Min(0)
  price: number;
  @IsArray()
  @IsString({ each: true })
  taken: string[];
}
