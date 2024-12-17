"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_error_1 = require("zod-error");
class ValidationError extends Error {
    statusCode = 400;
    errors;
    constructor(error) {
        super('Validation Error');
        this.errors = this.stringifyErrors(error);
    }
    stringifyErrors(error) {
        const errorString = (0, zod_error_1.generateErrorMessage)(error.issues, {
            code: {
                enabled: false,
            },
            path: {
                enabled: true,
                transform: ({ value }) => (value ? value : ''),
                type: 'breadcrumbs',
            },
            message: {
                enabled: true,
                transform: ({ value }) => (value ? value : ''),
            },
            delimiter: {
                component: '',
                error: '\n',
            },
            transform: ({ index, pathComponent, messageComponent }) => {
                const pathMessage = pathComponent
                    ? ` at ${pathComponent}`
                    : '';
                return `Error ${index + 1}${pathMessage}: ${messageComponent}`;
            },
        });
        return errorString;
    }
}
exports.default = ValidationError;
