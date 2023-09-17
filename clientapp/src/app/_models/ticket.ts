import { ChatReply } from "./reply";
import { User } from "./user";

export class Ticket {
    id?: string;
    aju?: string;
    nopen?: number;
    pendate?: Date;
    name?: string;
    messages: ChatReply[];
    problem?: string;
    isSolved?: boolean;
    creator?: User;
    createdAt?: Date;
    updatedAt?: Date;
}