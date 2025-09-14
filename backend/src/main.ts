import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true }, // 👈 مهم
}));

  const cfg = app.get(ConfigService);
  const FRONTEND = cfg.get<string>('FRONTEND_ORIGIN') ?? 'http://localhost:4200';
  app.enableCors({ origin: [FRONTEND, 'http://localhost'], credentials: false });

  // كل المسارات تحت /api (ما عدا /healthz لو عندك)
  app.setGlobalPrefix('api', { exclude: ['healthz'] });

  app.enableShutdownHooks();
  const port = cfg.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`[BOOT] Server running on http://localhost:${port}`);
}
bootstrap();
