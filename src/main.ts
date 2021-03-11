import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import { useContainer } from 'class-validator';
import { TransformUploadPipe } from './modules/shared/pipes/transform-upload.pipe';
import { SharedModule } from './modules/shared/shared.module';
import { RolesGuard } from './modules/shared/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);

  const rolesGuard = app.select(SharedModule).get(RolesGuard);

  app.useGlobalGuards(rolesGuard);

  app.useGlobalPipes(
    new TransformUploadPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.enableCors();
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });
  useContainer(app.select(AppModule), {
    fallback: true,
    fallbackOnErrors: true,
  });

  await app.listen(port);

  console.log(`🚀 Application is running on port ${port}`);
}
bootstrap();
