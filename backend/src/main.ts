import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';
import { DevLogger } from './logger/dev.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  }
  );
  app.setGlobalPrefix('api/afisha');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const loggerType = process.env.LOGGER_TYPE || 'dev';
  let logger;
  
  switch (loggerType) {
    case 'json':
      logger = new JsonLogger();
      break;
    case 'tskv':
      logger = new TskvLogger();
      break;
    default:
      logger = new DevLogger();
  }
  
  app.useLogger(logger);
  
  await app.listen(3000);
}
bootstrap();
