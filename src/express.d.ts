import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            user_id?: string; // or the appropriate type
        }
    }
}
