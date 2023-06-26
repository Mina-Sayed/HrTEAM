"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const documents_controller_1 = require("./../../controllers/user/documents.controller");
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const subscription_1 = require("../../middlewares/subscription");
const router = (0, express_1.Router)();
router
    .route('/')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .post(documents_controller_1.addDocument)
    .get(documents_controller_1.getDocumentUser);
router
    .route('/:id')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .delete(documents_controller_1.deleteDocument);
exports.default = router;
