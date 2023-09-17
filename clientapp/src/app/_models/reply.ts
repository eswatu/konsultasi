import { UserChat } from "./user";

export class ChatReply {
    id?: string;
    user: UserChat;
    roomId: string;
    message: string;
    time: Date;
}