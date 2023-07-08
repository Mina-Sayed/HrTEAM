"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const validator = (validator, mode) => {
    return (req, res, next) => {
        console.log(mode);
        const { error } = validator(req.body, mode);
        if (error)
            return res.status(400).send(error.details[0].message);
        next();
    };
};
exports.validator = validator;
