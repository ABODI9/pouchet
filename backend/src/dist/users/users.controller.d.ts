import { UsersService } from './users.service';
export declare class UsersController {
  private users;
  constructor(users: UsersService);
  list(): Promise<import('./entities/user.entity').User[]>;
}
