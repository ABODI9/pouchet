import { OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
export declare class UsersModule implements OnModuleInit {
    private users;
    constructor(users: UsersService);
    onModuleInit(): Promise<void>;
}
