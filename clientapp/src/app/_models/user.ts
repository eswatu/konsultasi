export class User {
    id?: string;
    username?: string;
    password?: string;
    name?: string;
    company?: string;
    role?: string;
    contact?: string;
    isActive?: boolean;
    jwtToken?: string;
}

export class UserChat {
    id?: string;
    name?: string;
    company?: string;
    role?: string;
}