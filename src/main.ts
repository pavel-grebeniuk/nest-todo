import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  console.log(`🚀 Application is running on port ${port}`);
}
bootstrap();
