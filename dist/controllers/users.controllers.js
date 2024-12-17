"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getOneUser = getOneUser;
exports.register = register;
exports.login = login;
exports.checkSession = checkSession;
exports.logout = logout;
exports.createProjectForUser = createProjectForUser;
exports.getUserProjects = getUserProjects;
exports.deleteProject = deleteProject;
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_1 = __importDefault(require("../db/connection"));
const schema_1 = require("../db/schema");
const userSchemas_1 = require("../schemas/userSchemas");
const HttpError_1 = __importDefault(require("../errors/HttpError"));
const ValidationError_1 = __importDefault(require("../errors/ValidationError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function getAllUsers(req, res) {
    const allUsers = await connection_1.default.select().from(schema_1.users);
    res.send(allUsers);
}
async function getOneUser(req, res) {
    const userId = req.params.userId;
    // Verificaríamos y si no, error
    const { success, data: id, error } = userSchemas_1.IdSchema.safeParse(userId);
    if (!success) {
        throw new ValidationError_1.default(error);
    }
    const [user] = await connection_1.default
        .select()
        .from(schema_1.users)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.id, id)));
    if (!user) {
        throw new HttpError_1.default(404, `User with ID ${id} not found`);
    }
    res.send(user);
}
async function register(req, res) {
    const user = req.body;
    // Validamos usuario
    const { success, data: newUser, error } = userSchemas_1.RegisterSchema.safeParse(user);
    if (!success) {
        throw new ValidationError_1.default(error);
    }
    // Como sabemos que ha ido bien, ahora ya podemos encriptar la contraseña
    const saltNumber = 10;
    const encriptedPassword = await bcrypt_1.default.hash(newUser.password, saltNumber);
    // cambiar contraseña plana por encriptada
    newUser.password = encriptedPassword;
    const [userDB] = await connection_1.default.insert(schema_1.users).values(newUser).returning({
        id: schema_1.users.id,
        name: schema_1.users.name,
    });
    res.status(201).send(userDB);
}
async function login(req, res) {
    const { success, data: loginUser, error } = userSchemas_1.LoginSchema.safeParse(req.body);
    if (!success) {
        throw new ValidationError_1.default(error);
    }
    const [user] = await connection_1.default
        .select()
        .from(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.email, loginUser.email));
    if (!user) {
        throw new HttpError_1.default(404, 'Email or password incorrect');
    }
    const isPasswordCorrect = await bcrypt_1.default.compare(loginUser.password, user.password);
    if (!isPasswordCorrect) {
        throw new HttpError_1.default(404, 'Email or password incorrect');
    }
    const userToSend = {
        id: user.id,
        name: user.name,
    };
    const token = jsonwebtoken_1.default.sign(userToSend, process.env.TOKEN_SECRET, {
        expiresIn: 3600,
    });
    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1000,
        sameSite: 'none',
        secure: true,
    });
    res.send(userToSend);
}
async function checkSession(req, res) {
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
    res.status(200).send({ message: 'Session is valid', user: payload });
}
async function logout(req, res) {
    res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });
    res.send({ message: 'Logged out successfully' });
}
async function createProjectForUser(userId, projectName) {
    // Paso 1: Verificar si el proyecto con el mismo nombre ya existe
    const existingProject = await connection_1.default
        .select()
        .from(schema_1.projects)
        .innerJoin(schema_1.userProjects, (0, drizzle_orm_1.eq)(schema_1.userProjects.projectId, schema_1.projects.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userProjects.userId, userId), (0, drizzle_orm_1.eq)(schema_1.projects.name, projectName)))
        .limit(1);
    if (existingProject.length > 0) {
        // Paso 2: Si ya existe, devolver un mensaje de error
        return { message: 'No se puede crear un proyecto con el mismo nombre.' };
    }
    // Paso 3: Crear el nuevo proyecto
    const newProject = await connection_1.default
        .insert(schema_1.projects)
        .values({
        name: projectName,
    })
        .returning({ id: schema_1.projects.id, name: schema_1.projects.name });
    // Paso 4: Asociar el proyecto al usuario en la tabla intermedia
    await connection_1.default.insert(schema_1.userProjects).values({
        userId: userId,
        projectId: newProject[0].id,
    });
    return newProject[0];
}
async function getUserProjects(userId) {
    const data = await connection_1.default
        .select()
        .from(schema_1.projects)
        .innerJoin(schema_1.userProjects, (0, drizzle_orm_1.eq)(schema_1.userProjects.projectId, schema_1.projects.id))
        .where((0, drizzle_orm_1.eq)(schema_1.userProjects.userId, userId));
    return data.map((item) => item.projects);
}
async function deleteProject(projectId) {
    await connection_1.default.delete(schema_1.cards).where((0, drizzle_orm_1.eq)(schema_1.cards.projectId, projectId));
    await connection_1.default.delete(schema_1.userProjects).where((0, drizzle_orm_1.eq)(schema_1.userProjects.projectId, projectId));
    await connection_1.default.delete(schema_1.projects).where((0, drizzle_orm_1.eq)(schema_1.projects.id, projectId));
}
