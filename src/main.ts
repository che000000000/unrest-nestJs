import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
  const configService = app.get(ConfigService)
  await app.listen(configService.get('appPort'))
}
bootstrap()