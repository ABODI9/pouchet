import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const cfg = app.get(ConfigService);
  const FRONTEND = cfg.get<string>('FRONTEND_ORIGIN') ?? 'http://localhost:4200';
  app.enableCors({ origin: [FRONTEND, 'http://localhost'], credentials: false });

  // كل شيء تحت /api (ما عدا healthz)
  app.setGlobalPrefix('api', { exclude: ['healthz'] });

  // تنبيه على متغيرات البيئة
  const reqEnv = ['JWT_SECRET','DB_HOST','DB_PORT','DB_DATABASE','DB_USERNAME','DB_PASSWORD'] as const;
  const missing = reqEnv.filter(k => !process.env[k] || String(process.env[k]).trim() === '');
  if (missing.length) console.warn('[BOOT] Missing env vars →', missing.join(', '));

  // Self-check للـJWT (لا ترسل issuer/audience لو فاضية)
  try {
    const jwt = app.get(JwtService);
    const token = await jwt.signAsync({ sub: 'selftest', email: 'self@test', role: 'user' }, {
      secret: cfg.get('JWT_SECRET', 'dev_secret_change_me'),
      expiresIn: '5m',
      ...(cfg.get('JWT_ISSUER')?.trim() ? { issuer: cfg.get('JWT_ISSUER')!.trim() } : {}),
      ...(cfg.get('JWT_AUDIENCE')?.trim() ? { audience: cfg.get('JWT_AUDIENCE')!.trim() } : {}),
    });

    await jwt.verifyAsync(token, {
      secret: cfg.get('JWT_SECRET', 'dev_secret_change_me'),
      ...(cfg.get('JWT_ISSUER')?.trim() ? { issuer: cfg.get('JWT_ISSUER')!.trim() } : {}),
      ...(cfg.get('JWT_AUDIENCE')?.trim() ? { audience: cfg.get('JWT_AUDIENCE')!.trim() } : {}),
    });
    console.log('[BOOT] JWT self-check OK');
  } catch (e: any) {
    console.error('[BOOT] JWT self-check FAILED →', e.message);
  }

  app.enableShutdownHooks();
  const port = cfg.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`[BOOT] Server running on http://localhost:${port}`);
}
bootstrap();
