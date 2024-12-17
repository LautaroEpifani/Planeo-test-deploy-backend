"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = __importDefault(require("../errors/HttpError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function userAuth(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        throw new HttpError_1.default(401, 'You must send an access token');
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
    }
    catch (error) {
        throw new HttpError_1.default(401, 'Token invalid or expired');
    }
    req.user = payload;
    next();
}
exports.default = userAuth;
