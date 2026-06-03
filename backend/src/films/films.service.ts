import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import {
  FilmsRepository,
} from '../repository/films.repository';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  private toFilmDto(doc: Film): FilmDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { schedules: _, ...film } = doc;
    return film;
  }

  async findAll(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmsRepository.findAll();

    const items: FilmDto[] = films.map(this.toFilmDto);

    return {
      total: items.length,
      items: items,
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
      total: film.schedules.length,
      items: film.schedules.map((s) => ({
        ...s,
        daytime:
          s.daytime instanceof Date
            ? s.daytime.toISOString()
            : String(s.daytime),
      })),
    };
  }
}
