declare namespace Express {
    interface Request {
        user?: any;
        auth?: any;
    }
    interface Response {
        user?: {
            name: string;
            role: string;
            token: string;
        };
        auth?: any;
    }
}