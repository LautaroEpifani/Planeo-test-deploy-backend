"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("express-async-errors");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const cardsRoutes_1 = __importDefault(require("./routes/cardsRoutes"));
const ValidationError_1 = __importDefault(require("./errors/ValidationError"));
const HttpError_1 = __importDefault(require("./errors/HttpError"));
// import { v2 as cloudinary } from 'cloudinary'
const users_controllers_1 = require("./controllers/users.controllers");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
}));
// Peticion normal
app.get("/", (req, res) => {
    res.send("<h1>hola</h1>");
});
app.use("/users", usersRoutes_1.default);
app.use("/cards", cardsRoutes_1.default);
app.get("/verifySession", users_controllers_1.checkSession);
app.get("/getProjects/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const projects = await (0, users_controllers_1.getUserProjects)(userId);
    if (projects) {
        res.send({ projects });
    }
    else {
        res.status(404).json({ message: "No se encontró el proyecto" });
    }
});
app.delete('/projects/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        await (0, users_controllers_1.deleteProject)(parseInt(projectId));
        res.status(200).send({ message: 'Proyecto y tarjetas asociadas eliminados correctamente' });
    }
    catch (error) {
        console.error('Error eliminando el proyecto:', error);
        res.status(500).send({ error: 'Error al eliminar el proyecto y sus tarjetas' });
    }
});
app.post("/createProject", async (req, res) => {
    const { userId, projectName } = req.body;
    try {
        const result = await (0, users_controllers_1.createProjectForUser)(userId, projectName);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Hubo un error al crear el proyecto." });
    }
});
// Middleware 404 not found
app.use((req, res) => {
    res.status(404).send({
        message: "Invalid route",
    });
});
app.use((error, req, res, next) => {
    if (error instanceof ValidationError_1.default) {
        res.status(error.statusCode).send({
            message: error.message,
            errors: error.errors,
        });
        return;
    }
    if (error instanceof HttpError_1.default) {
        res.status(error.statusCode).send({
            message: error.message,
        });
        return;
    }
    if (error instanceof Error) {
        res.status(500).send({
            message: error.message,
        });
    }
});
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}...`);
});
const shutdown = () => {
    console.log("Shutting down server...");
    server.close(() => {
        console.log("Server closed gracefully");
        process.exit(0);
    });
    // Si el servidor no cierra dentro de 10 segundos, forzamos el cierre
    setTimeout(() => {
        console.error("Forcing server shutdown");
        process.exit(1);
    }, 10000);
};
// Escucha señales de terminación
process.on("SIGINT", shutdown); // Ctrl + C
process.on("SIGTERM", shutdown);
