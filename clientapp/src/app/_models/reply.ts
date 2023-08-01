import { User } from "./user";

export class Reply {
    id?: string;
    ticketId?: string;
    creator?: User;
    message?: string;
    isKey: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}