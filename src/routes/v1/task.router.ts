import { authTask } from "../../middlewares/authorization/task.authorization";
import {
    assignTask,
    unassignTask,
} from "../../controllers/task/task.controller";
import { Roles } from "../../types/enums";
import { checkRole } from "../../middlewares/access";
import { authMiddleware } from "../../middlewares/auth";
import { Router } from "express";
import {
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    addTask,
} from "../../controllers/task/task.controller";
import { validator } from "../../middlewares/validator";
import { taskValidation } from "../../validators/task.validator";
import { checkSubscribe } from "../../middlewares/subscription";


const router = Router();
router
    .route("/")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
        checkSubscribe,
    )
    .get(authTask("task", "all"), getAllTasks)
    .post(
        validator(taskValidation, "post"),
        authTask("task", "post"),
        addTask,
    );

router
    .route("/assign/:id")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT, Roles.ADMIN),
        checkSubscribe,
    )
    .put(
        validator(taskValidation, "put"),
        authTask("task", "put"),
        assignTask,
    );
router
    .route("/unassign/:id")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT, Roles.ADMIN),
        checkSubscribe,
    )
    .put(
        validator(taskValidation, "put"),
        authTask("task", "put"),
        unassignTask,
    );
router
    .route("/:id")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
        checkSubscribe,
    )
    .get(
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
        authTask("task", "put"),
        getTaskById,
    )
    .delete(
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
        authTask("task", "delete"),
        deleteTask,
    )
    .put(
        checkRole(Roles.ROOT, Roles.ADMIN, Roles.EMPLOYEE),
        validator(taskValidation, "put"),
        authTask("task", "put"),
        updateTask,
    );

export default router;
