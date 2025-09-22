import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('JWT_SECRET', 'dev_secret_change_me'),
      ...(cfg.get('JWT_ISSUER')?.trim()
        ? { issuer: cfg.get('JWT_ISSUER')!.trim() }
        : {}),
      ...(cfg.get('JWT_AUDIENCE')?.trim()
        ? { audience: cfg.get('JWT_AUDIENCE')!.trim() }
        : {}),
      algorithms: ['HS256'],
    });
  }
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
