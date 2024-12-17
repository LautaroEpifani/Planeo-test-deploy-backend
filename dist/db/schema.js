"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProjects = exports.users = exports.projects = exports.cards = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.cards = (0, pg_core_1.pgTable)('cards', {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    cardName: (0, pg_core_1.varchar)('card_name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)(),
    createdBy: (0, pg_core_1.varchar)('created_by', { length: 255 }),
    assignedTo: (0, pg_core_1.varchar)('assigned_to', { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' }).default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' }).default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    status: (0, pg_core_1.varchar)({ length: 20 }).default('todo'),
    order: (0, pg_core_1.numeric)({ precision: 10, scale: 2 }),
    projectId: (0, pg_core_1.integer)('project_id').notNull(),
}, (table) => {
    return {
        fkProject: (0, pg_core_1.foreignKey)({
            columns: [table.projectId],
            foreignColumns: [exports.projects.id],
            name: 'fk_project',
        }).onDelete('cascade'),
        cardsStatusCheck: (0, pg_core_1.check)('cards_status_check', (0, drizzle_orm_1.sql) `(status)::text = ANY ((ARRAY['todo'::character varying, 'in-progress'::character varying, 'done'::character varying])::text[])`),
    };
});
exports.projects = (0, pg_core_1.pgTable)('projects', {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    name: (0, pg_core_1.varchar)({ length: 100 }).notNull(),
});
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)().primaryKey().notNull(),
    name: (0, pg_core_1.varchar)({ length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)({ length: 100 }).notNull(),
    password: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
}, (table) => {
    return {
        usersEmailKey: (0, pg_core_1.unique)('users_email_key').on(table.email),
    };
});
exports.userProjects = (0, pg_core_1.pgTable)('user_projects', {
    userId: (0, pg_core_1.integer)('user_id').notNull(),
    projectId: (0, pg_core_1.integer)('project_id').notNull(),
}, (table) => {
    return {
        userProjectsUserIdFkey: (0, pg_core_1.foreignKey)({
            columns: [table.userId],
            foreignColumns: [exports.users.id],
            name: 'user_projects_user_id_fkey',
        }).onDelete('cascade'),
        userProjectsProjectIdFkey: (0, pg_core_1.foreignKey)({
            columns: [table.projectId],
            foreignColumns: [exports.projects.id],
            name: 'user_projects_project_id_fkey',
        }).onDelete('cascade'),
        userProjectsPkey: (0, pg_core_1.primaryKey)({
            columns: [table.userId, table.projectId],
            name: 'user_projects_pkey',
        }),
    };
});
