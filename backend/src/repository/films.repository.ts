import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/schemas/film.schema';

export interface FilmWithSchedule extends Film {
  schedule: NonNullable<Film['schedule']>;
}

interface IFilmsRepository {
  findAll(): Promise<FilmWithSchedule[]>;
  findById(id: string): Promise<FilmWithSchedule | undefined>;
  findSessionById(
    filmId: string,
    sessionId: string,
  ): Promise<NonNullable<FilmWithSchedule['schedule']>[0] | undefined>;
  bookSeatsAtomic(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void>;
}

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll(): Promise<FilmWithSchedule[]> {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string): Promise<FilmWithSchedule | undefined> {
    return this.filmModel.findOne({ id }).lean().exec();
  }

  async findSessionById(filmId: string, sessionId: string) {
    const film = await this.filmModel
      .findOne({ id: filmId, 'schedule.id': sessionId })
      .select('schedule')
      .lean()
      .exec();

    if (!film) throw new NotFoundException('Фильм или сеанс не найдены');
    return film.schedule?.find((s) => s.id === sessionId);
  }

  async bookSeatsAtomic(filmId: string, sessionId: string, seats: string[]) {
    const result = await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $addToSet: { 'schedule.$.taken': { $each: seats } } },
      )
      .exec();

    if (result.modifiedCount === 0) {
      throw new BadRequestException(
        'Не удалось забронировать места. Возможно, они уже заняты.',
      );
    }
  }
}
