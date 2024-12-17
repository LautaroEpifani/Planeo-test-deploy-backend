"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCard = exports.updateCard = exports.createCard = exports.getCardById = exports.getAllCards = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const connection_1 = __importDefault(require("../db/connection"));
// Obtener todas las tarjetas
const getAllCards = async (req, res) => {
    try {
        const allCards = await connection_1.default.select().from(schema_1.cards);
        res.status(200).send(allCards); // Usamos send en vez de json
    }
    catch (error) {
        res.status(500).send({ error: 'Error fetching cards' });
    }
};
exports.getAllCards = getAllCards;
// Obtener una tarjeta por ID
const getCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const card = await connection_1.default
            .select()
            .from(schema_1.cards)
            .where((0, drizzle_orm_1.eq)(schema_1.cards.id, Number(id)))
            .limit(1);
        if (!card.length)
            res.status(404).send({ error: 'Card not found' });
        res.status(200).send(card[0]);
    }
    catch (error) {
        res.status(500).send({ error: 'Error fetching card' });
    }
};
exports.getCardById = getCardById;
// Crear una nueva tarjeta
const createCard = async (req, res) => {
    try {
        const { cardName, description, createdBy, assignedTo, status = 'todo', order, projectId, } = req.body; // Ahora se incluye el status
        const [newCard] = await connection_1.default
            .insert(schema_1.cards)
            .values({
            cardName,
            description,
            createdBy,
            assignedTo,
            status,
            order,
            projectId,
        })
            .returning();
        res.status(201).send(newCard);
    }
    catch (error) {
        res.status(500).send({ error: 'Error creating card' });
    }
};
exports.createCard = createCard;
// Actualizar una tarjeta por ID
const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { cardName, description, createdBy, assignedTo, status, order } = req.body;
        const updatedAt = new Date().toISOString();
        const updatedCard = await connection_1.default
            .update(schema_1.cards)
            .set({
            cardName,
            description,
            createdBy,
            assignedTo,
            status,
            order,
            updatedAt,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.cards.id, Number(id)))
            .returning();
        if (!updatedCard.length)
            res.status(404).send({ error: 'Card not found' });
        res.status(200).send(updatedCard[0]);
    }
    catch (error) {
        res.status(500).send({ error: 'Error updating card' });
    }
};
exports.updateCard = updateCard;
// Eliminar una tarjeta por ID
const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        // Eliminar la tarjeta por ID
        const deletedCard = await connection_1.default
            .delete(schema_1.cards)
            .where((0, drizzle_orm_1.eq)(schema_1.cards.id, Number(id)))
            .returning();
        if (!deletedCard.length) {
            res.status(404).send({ error: 'Card not found' }); // Usamos send
        }
        res.status(200).send({ message: 'Card deleted successfully', deletedCard }); // Usamos send
    }
    catch (error) {
        res.status(500).send({ error: 'Error deleting card' });
    }
};
exports.deleteCard = deleteCard;
