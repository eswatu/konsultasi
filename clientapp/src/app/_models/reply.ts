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
    roomName: string;
    start: boolean;
  }

  export interface ApprovalData {
    roomName: string;
    result: boolean;
  }