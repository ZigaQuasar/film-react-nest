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
    return this.filmRepository.find({ relations: ['schedules'] });
  }

  async findById(id: string): Promise<Film | undefined> {
    return this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
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
    const result = await this.scheduleRepository
      .createQueryBuilder()
      .update(Schedule)
      .set({
        taken: () => `array_cat(taken, :seats::text[])`,
      })
      .where('id = :sessionId', { sessionId })
      .andWhere('"filmId" = :filmId', { filmId })
      .andWhere(`NOT (taken && :seats::text[])`, { seats })
      .setParameter('seats', `{${seats.join(',')}}`)
      .execute();

    return result.affected === 1;
  }
}
