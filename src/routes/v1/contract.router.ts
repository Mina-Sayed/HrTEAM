import { authContract } from "../../middlewares/authorization/contract.authorization";
import { checkSubscribe } from "../../middlewares/subscription";
import { Roles } from "../../types/enums";
import { checkRole } from "../../middlewares/access";
import { authMiddleware } from "../../middlewares/auth";
import { Router } from "express";
import {
    getAllContract,
    addContract,
    updateContract,
    getContractById,
    deleteContract,
    toggleGetContract,
    getUserContract,
} from "../../controllers/contract/contract.controller";

import { validator } from "../../middlewares/validator";
import { ContractValidation } from "../../validators/contract.validator";


const contract = Router();


contract.route("/getContractByUser/:userId?").get(authMiddleware,
    checkRole(Roles.ADMIN,
        Roles.EMPLOYEE,
        Roles.ROOT),
    getUserContract);

contract.route("/")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT,
            Roles.ADMIN),
        checkSubscribe,
    )
    .post(
        validator(ContractValidation,
            "post"),
        authContract("contract",
            "post"),
        addContract,
    );

contract.route("/all/filter/:company")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT,
            Roles.ADMIN,
            Roles.EMPLOYEE),
        checkSubscribe,
    ).get(authContract("contract",
        "get"),
    toggleGetContract);

contract.route("/all/:company?")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT,
            Roles.ADMIN,
            Roles.EMPLOYEE),
        checkSubscribe,
    ).get(authContract("contract",
        "get"),
    getAllContract);

// a7a ya abdo you made the user to delete his contract
contract
    .route("/:id")
    .all(authMiddleware,
        checkSubscribe)
    .get(
        checkRole(Roles.ROOT,
            Roles.ADMIN),
        authContract("contract",
            "get"),
        getContractById,
    ).put(
    checkRole(Roles.ROOT,
        Roles.ADMIN,
        Roles.EMPLOYEE),
    validator(ContractValidation,
        "put"),
    authContract("contract",
        "put"),
    updateContract,
).delete(authContract("contract",
        "delete"),
    checkRole(Roles.ROOT,
        Roles.ADMIN),
    deleteContract);

export default contract;
