declare namespace Express {
    export interface Request {
        user: any;
    }
    export interface Response {
        user: {
            name: string;
            role: string;
            token: string;
        };
    }
}