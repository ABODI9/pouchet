import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly rounds: number;

  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly cfg: ConfigService,
  ) {
    this.rounds = Number(this.cfg.get('BCRYPT_ROUNDS', '10'));
  }

  async create(dto: CreateUserDto, role: 'user' | 'admin' = 'user') {
    const email = dto.email.trim().toLowerCase();
    const name = dto.name.trim();

    const dup = await this.repo
      .createQueryBuilder('u')
      .where('LOWER(u.email) = LOWER(:email)', { email })
      .getOne();
    if (dup) throw new ConflictException('Email is already registered');

    const passwordHash = await bcrypt.hash(dto.password, this.rounds);

    const saved = await this.repo.save(
      this.repo.create({ email, name, role, passwordHash }),
    );
    const { passwordHash: _, ...safe } = saved as any;
    return safe;
  }

  async findByEmail(email: string) {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash') // لأن select:false
      .where('LOWER(u.email) = LOWER(:email)', {
        email: email.trim().toLowerCase(),
      })
      .getOne();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findAllPublic() {
    return this.repo.find({
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async seedAdmin() {
    const email = (process.env.ADMIN_EMAIL || 'admin@demo.local')
      .trim()
      .toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'Admin123!';
    const name = (process.env.ADMIN_NAME || 'Admin').trim();

    const exists = await this.repo
      .createQueryBuilder('u')
      .where('LOWER(u.email) = LOWER(:email)', { email })
      .getOne();
    if (exists) return;

    const passwordHash = await bcrypt.hash(password, this.rounds);
    await this.repo.save({ email, name, role: 'admin', passwordHash });
    console.log(`[seed] Admin created: ${email}`);
  }
}
