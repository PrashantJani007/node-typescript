import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { RequestHandler } from "express";
import { isTokenBlacklisted } from "../utils/tokenBlacklist";

interface DecodedToken {
    id: string;
}

export const authUser: RequestHandler = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (authorizationHeader) {
            const token = authorizationHeader.split(" ")[1];

            if (isTokenBlacklisted(token)) {
                return res.status(401).json({ error: "Unauthorized! Have been logged out." });
            }

            const decodedToken = jwt.verify(token, "SECRET") as DecodedToken;
            
            const userRole = await User.findOne({ where: { id: decodedToken.id } });

            if (userRole) {
                req.user_id = decodedToken.id; 
                next();
            } else {
                return res.status(403).json({ error: "Unauthorized!" });
            }
        } else {
            return res.status(403).json({ error: "Unauthorized!" });
        }
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export default authUser;
