import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto, TicketResponseDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(
    dto: CreateOrderDto,
  ): Promise<{ total: number; items: TicketResponseDto[] }> {
    const seatsBySession: Record<string, string[]> = {};
    for (const ticket of dto.tickets) {
      const key = `${ticket.film}|${ticket.session}`;
      if (!seatsBySession[key]) seatsBySession[key] = [];
      seatsBySession[key].push(`${ticket.row}:${ticket.seat}`);
    }

    for (const [key, seats] of Object.entries(seatsBySession)) {
      const [filmId, sessionId] = key.split('|');

      const session = await this.filmsRepository.findSessionById(
        filmId,
        sessionId,
      );
      if (!session) throw new BadRequestException('Session not found');

      const alreadyTaken = seats.filter((s) => session.taken?.includes(s));
      if (alreadyTaken.length > 0) {
        throw new BadRequestException(
          `Seats ${alreadyTaken.join(', ')} are already booked`,
        );
      }

      await this.filmsRepository.bookSeatsAtomic(filmId, sessionId, seats);
    }

    const items: TicketResponseDto[] = dto.tickets.map((t) => ({
      id: randomUUID(),
      film: t.film,
      session: t.session,
      daytime: t.daytime,
      row: t.row,
      seat: t.seat,
      price: t.price,
    }));

    return { total: items.length, items };
  }
}
