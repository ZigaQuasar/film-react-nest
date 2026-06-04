import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres' | 'mysql' | 'sqlite'>('DATABASE_DRIVER'),
        host: configService.get<string>('DATABASE_HOST') || 'localhost',
        port: configService.get<number>('DATABASE_PORT') || 5432,
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME') || 'films',
        entities: [Film, Schedule],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
