import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ScheduleSubDocument {
  @Prop({ required: true, type: String })
  id: string;

  @Prop({ required: true, type: Date })
  daytime: Date;

  @Prop({ required: true, type: Number })
  hall: number;

  @Prop({ required: true, type: Number, min: 1 })
  rows: number;

  @Prop({ required: true, type: Number, min: 1 })
  seats: number;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @Prop({ type: [String], default: [] })
  taken: string[];
}

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true, type: String, unique: true })
  id: string;

  @Prop({ type: Number, min: 0 })
  rating: number;

  @Prop({ type: String })
  director: string;

  @Prop([String])
  tags: string[];

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  about: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  cover: string;

  @Prop({ type: [ScheduleSubDocument], default: [] })
  schedule: ScheduleSubDocument[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
