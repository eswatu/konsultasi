import { User, UserChat } from "./user";

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
    kind: NotificationType;
    sender: User;
    roomId: string;
}
export interface SolveData {
    solver: User;
    roomId: string;
}
export enum NotificationType {
    newmessage = 'newmessage',
    newcountdown = 'newcountdown',
    newanswer = 'newanswer',
}