import { UserChat } from "./user";

export class ChatReply {
    id?: string;
    user: UserChat;
    roomId: string;
    message: string;
    time: Date;
}

// Define the types for the emitted values
export interface CountdownData {
    roomId: string;
    trigger: boolean;
  }
export interface NotificationData {
    kind: string;
    senderId:string;
    roomId: string;
}