import { Request } from "express";

declare module 'express-serve-static-core' {
    interface User {
        id: string;
        name: string;
        role: string;
        company: string;
    }
    interface Request {
        user?: User;
    }
}