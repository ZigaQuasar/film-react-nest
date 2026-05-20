import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

//TODO реализовать DTO для /orders
export class TicketDto {
  @IsUUID()
  film: string;
  @IsUUID()
  session: string;
  @IsDateString()
  daytime: string;
  @IsNumber()
  @Min(1)
  row: number;
  @IsNumber()
  @Min(1)
  seat: number;
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;
  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  phone: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class TicketResponseDto {
  id: string;
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}
