"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controllers_1 = require("../controllers/users.controllers");
const userRouter = express_1.default.Router();
userRouter.get('/', users_controllers_1.getAllUsers);
userRouter.get('/:userId', users_controllers_1.getOneUser);
userRouter.post('/register', users_controllers_1.register);
userRouter.post('/login', users_controllers_1.login);
// userRouter.post('/register', register);
userRouter.post('/logout', users_controllers_1.logout);
exports.default = userRouter;
