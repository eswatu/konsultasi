import { User, UserChat } from "./user";

export class Reply {
    id?: string;
    ticketId?: string;
    creator?: User;
    message?: string;
    isKey: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ChatReply {
    id?: string;
    user: UserChat;
    roomId: string;
    message: string;
    time: Date;
}