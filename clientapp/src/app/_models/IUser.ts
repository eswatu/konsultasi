import {Role} from '../auth/auth.enum'

export interface IUser {
    _id: string;
    username: string;
    password?: string;
    name: string;
    company: string;
    role: Role | string;
    contact: string;
    isActive: boolean;
    jwtToken?: string;
}