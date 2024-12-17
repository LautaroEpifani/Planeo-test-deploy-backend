"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.RegisterSchema = exports.IdSchema = void 0;
const zod_1 = require("zod");
const IdSchema = zod_1.z.coerce.number({
    invalid_type_error: 'The ID must be a number',
});
exports.IdSchema = IdSchema;
const RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name required').max(50, 'Max 50 characters'),
    email: zod_1.z
        .string()
        .email('Invalid email')
        .min(1, 'Email required')
        .max(150, 'Max 150 characters'),
    password: zod_1.z.string().min(1, 'Password required').max(16, 'Max 16 characters'),
});
exports.RegisterSchema = RegisterSchema;
const LoginSchema = RegisterSchema.pick({
    email: true,
    password: true,
});
exports.LoginSchema = LoginSchema;
