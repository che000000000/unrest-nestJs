export interface AuthReqInterface extends Request {
    user: {
        sub: string;
        email: string;
        userTag: string;
        name: string;
    }
}