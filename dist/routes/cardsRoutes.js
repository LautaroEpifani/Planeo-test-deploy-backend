"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cards_controllers_1 = require("../controllers/cards.controllers");
const cardsRouter = express_1.default.Router();
// CRUD Routes
cardsRouter.get('/', cards_controllers_1.getAllCards); // Obtener todas las tarjetas
cardsRouter.get('/:id', cards_controllers_1.getCardById); // Obtener una tarjeta por ID
cardsRouter.post('/', cards_controllers_1.createCard); // Crear una tarjeta
cardsRouter.put('/:id', cards_controllers_1.updateCard); // Actualizar una tarjeta por ID
cardsRouter.delete('/:id', cards_controllers_1.deleteCard); // Eliminar una tarjeta por ID
exports.default = cardsRouter;
