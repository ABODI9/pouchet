import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

type JwtClaims = { sub: string; email: string; role: string };

// src/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  async register(dto: CreateUserDto) {
    return this.users.create(dto, 'user'); // لو UsersService يهشّر (كما فوق)
  }

  async login(email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    const user = await this.users.findByEmail(normalized);

    if (!user || !user.passwordHash) {
      // لما يكون الـhash غير موجود أو المستخدم غير موجود
      throw new UnauthorizedException('Invalid credentials');
    }

    let ok = false;
    try {
      ok = await bcrypt.compare(password, user.passwordHash);
    } catch {
      // في حال كان الـhash تالف/غير صالح (seed قديم)
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwt.signAsync(payload, {
      secret: this.cfg.get('JWT_SECRET', 'dev_secret_change_me'),
      expiresIn: this.cfg.get('JWT_EXPIRES', '2h'),
      issuer: this.cfg.get('JWT_ISSUER') || undefined,
      audience: this.cfg.get('JWT_AUDIENCE') || undefined,
    });
    return { access_token };
  }
}
