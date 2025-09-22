import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
  private readonly users;
  private readonly jwt;
  constructor(users: UsersService, jwt: JwtService);
  register(dto: CreateUserDto): Promise<{
    id: string;
    email: string;
    name: string;
    role: import('../users/entities/user.entity').Role;
    createdAt: Date;
    updatedAt: Date;
  }>;
  login(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
  }>;
}
