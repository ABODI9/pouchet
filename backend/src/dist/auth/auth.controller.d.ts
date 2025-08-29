import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../users/entities/user.entity").Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    me(req: any): any;
}
