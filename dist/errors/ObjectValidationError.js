"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectValidationError extends Error {
    statusCode = 400;
    errors;
    constructor(error) {
        super('Validation Error');
        this.errors = this.flattenErrors(error);
    }
    flattenErrors(error) {
        return error.flatten().fieldErrors;
    }
}
exports.default = ObjectValidationError;
