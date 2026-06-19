import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

interface IFilmsRepository {
  findAll(): Promise<Film[]>;
  findById(id: string): Promise<Film | undefined>;
  findSessionById(
    filmId: string,
    sessionId: string,
  ): Promise<Schedule | undefined>;
  bookSeatsAtomic(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean>;
}

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ){}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.find();
  }

  async findById(id: string): Promise<Film | undefined> {
    return this.filmRepository.findOne({
      where: { id }
    });
  }

  async findSessionById(filmId: string, sessionId: string) {
    return this.scheduleRepository.findOne({
    where: {
      id: sessionId,
      film: { id: filmId }
      }
    });
  }

  async bookSeatsAtomic(
    filmId: string,
    sessionId: string,
    seats: string[]
  ): Promise<boolean> {
    const seatsStr = seats.join(',');
    const result = await this.scheduleRepository
      .createQueryBuilder()
      .update(Schedule)
      .set({
        taken: () => `CASE WHEN taken = '' THEN :newSeats ELSE taken || ',' || :newSeats END`,
      })
      .where('id = :sessionId', { sessionId })
      .andWhere('"filmId" = :filmId', { filmId })
      .andWhere(`(taken = '' OR NOT (string_to_array(taken, ',') && :checkSeats::text[]))`)
      .setParameter('newSeats', seatsStr)
      .setParameter('checkSeats', `{${seatsStr}}`)
      .execute();

    return result.affected === 1;
  }
}
