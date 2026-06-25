import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  });

  // validates all incoming request bodies using DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // strips fields not in DTO
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
