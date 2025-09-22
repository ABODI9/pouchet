import { Repository } from 'typeorm';
import { User, Role } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
  private repo;
  constructor(repo: Repository<User>);
  seedAdmin(): Promise<void>;
  create(
    dto: CreateUserDto,
    role?: Role,
  ): Promise<{
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAllPublic(): Promise<User[]>;
}
