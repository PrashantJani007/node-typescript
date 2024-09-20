"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const tokenBlacklist_1 = require("../utils/tokenBlacklist");
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            const token = authorizationHeader.split(" ")[1];
            if ((0, tokenBlacklist_1.isTokenBlacklisted)(token)) {
                return res.status(401).json({ error: "Unauthorized! Token has been invalidated." });
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, "SECRET");
            const userRole = yield user_1.User.findOne({ where: { id: decodedToken.id } });
            if (userRole) {
                req.user_id = decodedToken.id;
                next();
            }
            else {
                return res.status(403).json({ error: "Unauthorized!" });
            }
        }
        else {
            return res.status(403).json({ error: "Unauthorized!" });
        }
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.authUser = authUser;
exports.default = exports.authUser;
