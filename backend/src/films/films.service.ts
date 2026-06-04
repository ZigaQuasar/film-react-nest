import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import {
  FilmsRepository,
} from '../repository/films.repository';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}


  async findAll(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmsRepository.findAll();

    return {
      total: films.length,
      items: films,
    };
  }

  async findSchedule(
    id: string,
  ): Promise<{ total: number; items: ScheduleDto[] }> {
    const film = await this.filmsRepository.findById(id);

    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    return {
      total: film.schedule.length,
      items: film.schedule
    };
  }
}
