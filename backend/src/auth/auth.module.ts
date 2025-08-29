import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (cfg: ConfigService) => {
    const issuer = (cfg.get<string>('JWT_ISSUER') || '').trim();
    const audience = (cfg.get<string>('JWT_AUDIENCE') || '').trim();

    return {
      secret: cfg.get<string>('JWT_SECRET', 'dev_secret_change_me'),
      signOptions: {
        expiresIn: cfg.get<string>('JWT_EXPIRES', '2h'),
        ...(issuer ? { issuer } : {}),
        ...(audience ? { audience } : {}),
        algorithm: 'HS256',
      },
    };
  },
})

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
