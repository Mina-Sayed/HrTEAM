"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subtask_controller_1 = require("../../controllers/subtask/subtask.controller");
const validate_1 = require("../../middlewares/validate");
const subTask_validator_1 = require("../../validators/subTask.validator");
const router = (0, express_1.Router)();
router.route('/:task')
    .get(subtask_controller_1.getAllSubTasks)
    .post((0, validate_1.validator)(subTask_validator_1.subTaskValidation, 'post'), subtask_controller_1.addSubTask);
router.route('/:id')
    .get(subtask_controller_1.getSubTaskById)
    .put((0, validate_1.validator)(subTask_validator_1.subTaskValidation, 'put'), subtask_controller_1.updateSubTask)
    .delete(subtask_controller_1.deleteSubTask);
exports.default = router;
