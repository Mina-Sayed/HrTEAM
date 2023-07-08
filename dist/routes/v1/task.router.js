"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_authuthration_1 = require("./../../middlewares/authuthrations/task.authuthration");
const task_controller_1 = require("./../../controllers/task/task.controller");
const enums_1 = require("./../../types/enums");
const acsses_1 = require("./../../middlewares/acsses");
const auth_1 = require("./../../middlewares/auth");
const express_1 = require("express");
const task_controller_2 = require("../../controllers/task/task.controller");
const validate_1 = require("../../middlewares/validate");
const task_validator_1 = require("../../validators/task.validator");
const subscription_1 = require("../../middlewares/subscription");
const router = (0, express_1.Router)();
router
    .route('/')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), subscription_1.checkSubscripe)
    .get((0, task_authuthration_1.AuthuthrationTask)('task', 'all'), task_controller_2.getAllTasks)
    .post((0, validate_1.validator)(task_validator_1.taskValidation, 'post'), (0, task_authuthration_1.AuthuthrationTask)('task', 'post'), task_controller_2.addTask);
router
    .route('/assgin/:id')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), subscription_1.checkSubscripe)
    .put((0, validate_1.validator)(task_validator_1.taskValidation, 'put'), (0, task_authuthration_1.AuthuthrationTask)('task', 'put'), task_controller_1.assginTask);
router
    .route('/unassgin/:id')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), subscription_1.checkSubscripe)
    .put((0, validate_1.validator)(task_validator_1.taskValidation, 'put'), (0, task_authuthration_1.AuthuthrationTask)('task', 'put'), task_controller_1.unassginTask);
router
    .route('/:id')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), subscription_1.checkSubscripe)
    .get((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), (0, task_authuthration_1.AuthuthrationTask)('task', 'put'), task_controller_2.getTaskById)
    .delete((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), (0, task_authuthration_1.AuthuthrationTask)('task', 'delete'), task_controller_2.deleteTask)
    .put((0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE), (0, validate_1.validator)(task_validator_1.taskValidation, 'put'), (0, task_authuthration_1.AuthuthrationTask)('task', 'put'), task_controller_2.updateTask);
exports.default = router;
