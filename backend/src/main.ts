import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const cfg = app.get(ConfigService);

  // FRONTEND_ORIGIN يدعم قائمة مفصولة بفواصل
  const origins = (
    cfg.get<string>('FRONTEND_ORIGIN') ?? 'http://localhost:4200'
  )
    .split(',')
    .map((s) => s.trim());

  app.enableCors({ origin: origins, credentials: false });

  app.setGlobalPrefix('api', { exclude: ['healthz'] });

  const port = Number(process.env.PORT ?? cfg.get<number>('PORT') ?? 3000);
  await app.listen(port, '0.0.0.0'); // مهم لبيئات الاستضافة
  console.log(`[BOOT] Server running on :${port}`);
}
bootstrap();
