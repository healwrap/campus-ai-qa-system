import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // 使用 Pino logger
  app.useLogger(app.get(Logger));

  // 启用 API 版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 启用 CORS
  app.enableCors();

  // 添加验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  const logger = app.get(Logger);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
