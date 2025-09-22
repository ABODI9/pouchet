export declare const ROLES_KEY = 'roles';
export declare const Roles: (
  ...roles: ('user' | 'admin')[]
) => import('@nestjs/common').CustomDecorator<string>;
