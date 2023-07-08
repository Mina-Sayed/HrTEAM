"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorResponse_1 = require("./errorResponse");
const errorHandler = (err, req, res, next) => {
    console.log("dadadad", err, "errorrrrrr");
    let error;
    //Mongose bad objectId
    if (err.name == 'CastError') {
        const message = `the prodact not found with id of ${err.value}`;
        error = new errorResponse_1.ErorrResponse(message, 404);
    }
    //Error dublicate key
    if (err.code === 1100) {
        const message = 'Dublicate field value entered ';
        error = new errorResponse_1.ErorrResponse(message, 400);
    }
    //Mongose Validtion Error "HttpErrorResponse"
    if (err.name == 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new errorResponse_1.ErorrResponse(message, 500);
    }
    console.log(err);
    res.status((error === null || error === void 0 ? void 0 : error.statusCode) || 500).send({
        success: false,
        error: (error === null || error === void 0 ? void 0 : error.message) || 'SERVER ERROR',
    });
};
exports.errorHandler = errorHandler;
