"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../../controllers/user/index");
const employee_admin_authuthration_1 = require("./../../middlewares/authuthrations/employee_admin.authuthration");
const getAllUsers_1 = require("./../../controllers/user/getAllUsers");
const express_1 = require("express");
const createUser_1 = require("../../controllers/user/createUser");
const deleteUser_1 = require("../../controllers/user/deleteUser");
const getAllUsers_2 = require("../../controllers/user/getAllUsers");
const getUserById_1 = require("../../controllers/user/getUserById");
const updateUser_1 = require("../../controllers/user/updateUser");
const acsses_1 = require("../../middlewares/acsses");
const auth_1 = require("../../middlewares/auth");
const checkPrivilages_1 = require("../../middlewares/checkPrivilages");
const checkUserFound_1 = __importDefault(require("../../middlewares/checkUserFound"));
const validate_1 = require("../../middlewares/validate");
const enums_1 = require("../../types/enums");
const userValidator_1 = require("../../validators/userValidator");
const user_1 = require("../../controllers/user");
const subscription_1 = require("../../middlewares/subscription");
const userRouter = (0, express_1.Router)();
//(START)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT)
// to get all admins on company
userRouter
    .route('/admins/comapny/:company')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('admin', 'get'), subscription_1.checkSubscripe)
    .get(getAllUsers_1.getAllAdminsInCompany);
userRouter.route('/me').all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe).get(user_1.getMe);
// to get all admins on branch
userRouter
    .route('/admins/branch/:branch')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('admin', 'get'), subscription_1.checkSubscripe)
    .get(getAllUsers_1.getAllAdminsInBranch);
// to get all admins on department
userRouter
    .route('/admins/department/:department')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('admin', 'get'), subscription_1.checkSubscripe)
    .get(getAllUsers_1.getAllEmployeesInDepartment);
userRouter
    .route('/admins')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get((0, acsses_1.checkRole)(enums_1.Roles.ROOT), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('admin', 'get'), getAllUsers_1.getAllAdmins)
    .post((0, acsses_1.checkRole)(enums_1.Roles.ROOT), (0, validate_1.validator)(userValidator_1.validateUserPost, 'post'), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('admin', 'post'), checkUserFound_1.default, createUser_1.createAdmin);
//(ADMIN,ROOT)
userRouter
    .route('/admins/:id')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get((0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('admin', 'get'), getUserById_1.getAdmin)
    .all((0, acsses_1.checkRole)(enums_1.Roles.ROOT), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('admin', 'put'), subscription_1.checkSubscripe)
    .put((0, validate_1.validator)(userValidator_1.validateUserPut, 'put'), (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), checkUserFound_1.default, updateUser_1.updateAdmin)
    .delete((0, acsses_1.checkRole)(enums_1.Roles.ROOT), deleteUser_1.deleteAdmin);
//(END)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT)
//(START)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT,EMPLOYEE,ADMIN)
// to get all empolyees on company
userRouter.route('/employees/getAllWithBranchAndDepartment/:companyId').get(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), getAllUsers_1.getAllEmployeesInTheCompanyWithBranchAndDepartment);
userRouter
    .route('/employees/company/:company')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('employee', 'get'), subscription_1.checkSubscripe)
    .get(getAllUsers_1.getAllEmployeesInComapny);
// to get all empolyees on branch
userRouter
    .route('/employees/branch/:branch')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('employee', 'get'), subscription_1.checkSubscripe)
    .get(getAllUsers_1.getAllEmployeesInBranch);
// to get all empolyees on department
userRouter
    .route('/employees/department/:department')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('employee', 'get'), subscription_1.checkSubscripe)
    .get(getAllUsers_1.getAllEmployeesInDepartment);
// to get all empolyees on shift
userRouter
    .route('/employees/shift/:shift')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('employee', 'get'), subscription_1.checkSubscripe)
    .get(getAllUsers_1.getAllEmployeesInShift);
userRouter
    .route('/employees')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT))
    .get(getAllUsers_2.getAllEmployees)
    .post(checkUserFound_1.default, (0, validate_1.validator)(userValidator_1.validateUserPost, 'post'), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('employee', 'post'), createUser_1.createEmployee);
userRouter
    .route('/employee/:id')
    .all(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe)
    .get((0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('employee', 'get'), getUserById_1.getEmployee)
    //(ADMIN,ROOT)
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ROOT, enums_1.Roles.ADMIN), subscription_1.checkSubscripe)
    .put((0, validate_1.validator)(userValidator_1.validateUserPut, 'put'), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('employee', 'put'), checkUserFound_1.default, updateUser_1.updateEmployee)
    .delete((0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('employee', 'delete'), deleteUser_1.deleteEmployee);
//(EMPLOYEE)
userRouter
    .route('/employee/infoCompany')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.EMPLOYEE), (0, employee_admin_authuthration_1.AuthuthrationAdminEmployee)('employee', 'get'), subscription_1.checkSubscripe)
    .get(getAllUsers_1.getRootAndAdmin);
//(END)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT,EMPLOYEE,ADMIN)
userRouter
    .route('/superadmins')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN))
    .get(getAllUsers_2.getAllSuperAdmins)
    .post((0, validate_1.validator)(userValidator_1.validateUserPost, 'post'), checkUserFound_1.default, createUser_1.createSuperAdmin);
userRouter
    .route('/superadmins/:id')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN))
    .get(getUserById_1.getEmployee)
    .all(checkPrivilages_1.checkUpdatePrivilage)
    .patch((0, validate_1.validator)(userValidator_1.validateUserPut, 'put'), checkUserFound_1.default, updateUser_1.updateSuperAdmin)
    .delete(deleteUser_1.deleteSuperAdmin);
userRouter
    .route('/roots')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN))
    .get(getAllUsers_2.getAllRoots);
// .post(checkRole(Roles.ADMIN, Roles.ROOT), checkUserFound, validator(validateUserPost,"post"), createRoot);
userRouter
    .route('/roots/:id')
    .all(auth_1.AuthenticationMiddleware)
    .get(getUserById_1.getRoot, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE, enums_1.Roles.SUPER_ADMIN))
    .all((0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN), checkPrivilages_1.checkUpdatePrivilage)
    .patch((0, acsses_1.checkRole)(enums_1.Roles.ROOT), (0, validate_1.validator)(userValidator_1.validateUserPut, 'put'), checkUserFound_1.default, updateUser_1.updateRoot)
    .delete((0, acsses_1.checkRole)(enums_1.Roles.SUPER_ADMIN), deleteUser_1.deleteRoot);
userRouter
    .route('/me/')
    .all(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT, enums_1.Roles.EMPLOYEE, enums_1.Roles.SUPER_ADMIN), checkUserFound_1.default, subscription_1.checkSubscripe)
    .get(user_1.getMe);
userRouter.route('/updateUser/:userId').put(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE, enums_1.Roles.ROOT), updateUser_1.updateUser);
userRouter.route('/:id').get(auth_1.AuthenticationMiddleware, subscription_1.checkSubscripe, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.ROOT), index_1.getUser);
userRouter.route('/employees/getAllByRole').get(auth_1.AuthenticationMiddleware, (0, acsses_1.checkRole)(enums_1.Roles.ADMIN, enums_1.Roles.EMPLOYEE, enums_1.Roles.ROOT), getAllUsers_1.getAllEmpsBasedOnRole);
// this will take the branch and department as query 
exports.default = userRouter;
