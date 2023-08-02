import { User } from "./user";

export class Ticket {
    id?: string;
    aju?: string;
    nopen?: number;
    pendate?: Date;
    name?: string;
    problem?: string;
    isSolved?: boolean;
    creator?: User;
    createdAt?: Date;
    updatedAt?: Date;
}