import { MessageDocument } from "./message";
import { User } from "./user";

export class Ticket {
    id?: string;
    dokumen: {
        aju?: string;
        daftar?: number;
        tanggal: Date;
        nama: string;
    }
    messages: MessageDocument[];
    problem?: string;
    creator?: User;
    solver? : User;
    createdAt?: Date;
    updatedAt?: Date;
    deleted: boolean;
}