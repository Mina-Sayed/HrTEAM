import { authMiddleware } from "../../middlewares/auth";
import { Response, Request, NextFunction, Router } from "express";
import {
  addCompany,
  deleteCompanyById,
  getCompanyByName,
  getOwnerCompanies,
  updateCompanyByName,
} from "../../controllers/company/company.controller";
import { validator } from "../../middlewares/validator";
import { ReqTypes, validateData } from "../../middlewares/validation.service";
import { companySchema, validateCompany } from "../../validators/company.validator";
import { checkRole } from "../../middlewares/access";
import { Roles } from "../../types/enums";
import { checkSubscribe } from "../../middlewares/subscription";
import { authCompany } from "../../middlewares/authorization/compnay.authorization";


const router = Router();
router
  .route("/")
  .all(authMiddleware, checkSubscribe, checkRole(Roles.ROOT))
  .post(validateData(companySchema, ReqTypes.body), addCompany)
  .get(authCompany("company"), getOwnerCompanies);
router
  .route("/:id")
  .all(authMiddleware)
  .put(
    authCompany("company"),
    checkSubscribe,
    checkRole(Roles.ROOT),
    validator(validateCompany, "put"),
    updateCompanyByName,
  )
  .get(
    authCompany("company"),
    checkRole(Roles.ROOT, Roles.ADMIN),
    getCompanyByName,
  ).delete(deleteCompanyById);
export default router;
