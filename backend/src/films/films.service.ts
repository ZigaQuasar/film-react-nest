import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import {
  FilmsRepository,
  FilmWithSchedule,
} from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  private toFilmDto(doc: FilmWithSchedule): FilmDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { schedule: _, ...film } = doc;
    return film;
  }

  private toScheduleDto(doc: FilmWithSchedule['schedule'][0]): ScheduleDto {
    const daytimeValue = doc.daytime;
    const daytimeIso =
      daytimeValue instanceof Date
        ? daytimeValue.toISOString()
        : String(daytimeValue);

    return {
      ...doc,
      daytime: daytimeIso,
      hall: String(doc.hall),
    };
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

    const schedule: ScheduleDto[] = film.schedule.map(this.toScheduleDto);

    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
