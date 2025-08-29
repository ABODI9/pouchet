export type Role = 'user' | 'admin';
export declare class User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
