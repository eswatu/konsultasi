import { User, UserChat } from "./user";

export class MessageDocument {
    id?: string;
    user: UserChat;
    type: string;
    value: string;
    responseTime: Date;
    isDeleted: boolean;
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