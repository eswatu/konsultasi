import { User } from "./user";

export class Ticket {
    id?: string;
    aju?: string;
    pendate?: Date;
    name?: string;
    problem?: string;
    isSolved?: boolean;
    creator?: User;
    createdAt?: Date;
    updatedAt?: Date;
}