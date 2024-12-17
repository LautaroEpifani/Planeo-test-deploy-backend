"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValueValidationError extends Error {
    statusCode = 400;
    errors;
    constructor(error) {
        super('Validation Error');
        this.errors = this.flattenErrors(error);
    }
    flattenErrors(error) {
        return error.flatten().formErrors;
    }
}
exports.default = ValueValidationError;
