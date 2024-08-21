declare namespace Express {
    interface Request {
        user?: {
            id: string;
            name: string;
            role: string;
            token: string;
        };
        auth?: any;
    }
    interface Response {
        user?: {
            id: string;
            name: string;
            role: string;
            token: string;
        };
        auth?: any;
    }
}