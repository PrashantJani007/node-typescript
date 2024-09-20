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
exports.logout = exports.profileDetails = exports.login = exports.signup = void 0;
const user_1 = require("../models/user");
const userValidation_1 = __importDefault(require("../validations/userValidation"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenBlacklist_1 = require("../utils/tokenBlacklist");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = (0, userValidation_1.default)(req.body);
        if (result.error) {
            return res
                .status(422)
                .json({ status: false, code: 422, message: result.error.message });
        }
        const checkEmail = yield user_1.User.findOne({ where: { email } });
        if (checkEmail != undefined) {
            return res
                .status(422)
                .json({ status: false, code: 422, message: "Email already exists!" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashPassword = yield bcryptjs_1.default.hash(password, salt);
        req.body.password = hashPassword;
        const user = yield user_1.User.create(req.body);
        return res.status(201).json({ status: true, code: 201, message: "User register successfully!" });
    }
    catch (error) {
        return res.status(400).json({ status: false, code: 400, message: error.message });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const getUser = yield user_1.User.findOne({ where: { email: email }, attributes: ['id', 'email', 'password'] });
        if (!getUser) {
            return res.status(400).json({ status: false, message: "Please enter correct credentials!" });
        }
        const validatePassword = yield bcryptjs_1.default.compare(password, getUser.password);
        if (!validatePassword)
            return res.status(400).json({ status: false, message: "Please enter correct credentials!" });
        const token = jsonwebtoken_1.default.sign({ id: getUser.id }, "SECRET", { expiresIn: '30m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: getUser.id }, "REFRESHTOKEN", { expiresIn: '30d' });
        const userData = yield user_1.User.findOne({ where: { id: getUser.id }, attributes: { exclude: ['password'] } });
        return res.status(200).json({ status: true, data: { userData, token, refreshToken }, message: "Logged In" });
    }
    catch (error) {
        return res.status(400).json({ status: false, code: 400, message: error.message });
    }
});
exports.login = login;
const profileDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getUserDetails = yield user_1.User.findOne({ where: { id: req.user_id }, attributes: { exclude: ['password'] } });
    return res.status(200).json({ data: getUserDetails });
});
exports.profileDetails = profileDetails;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided!" });
        }
        // Add the token to the blacklist
        (0, tokenBlacklist_1.addTokenToBlacklist)(token);
        return res.status(200).json({ status: true, message: "User logged out successfully." });
    }
    catch (error) {
        return res.status(500).json({ status: false, message: "Logout failed", error: error.message });
    }
});
exports.logout = logout;
