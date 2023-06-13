import { getUser } from "../../controllers/user";
import { authAdminEmployee } from "../../middlewares/authorization/employee_admin.authorization";
import {
    getAllEmployeesInComapny,
    getAllEmployeesInBranch,
    getAllEmployeesInDepartment,
    getAllAdminsInCompany,
    getAllAdminsInBranch,
    getAllAdmins,
    getRootAndAdmin,
    getAllEmployeesInShift,
    getAllEmpsBasedOnRole,
    getAllEmployeesInTheCompanyWithBranchAndDepartment,
} from "../../controllers/user/getAllUsers";
import { Router } from "express";
import {
    createAdmin,
    createEmployee,
    createSuperAdmin,
} from "../../controllers/user/createUser";
import {
    deleteAdmin,
    deleteEmployee,
    deleteRoot,
    deleteSuperAdmin,
} from "../../controllers/user/deleteUser";
import {
    getAllEmployees,
    getAllRoots,
    getAllSuperAdmins,
} from "../../controllers/user/getAllUsers";
import {
    getAdmin,
    getEmployee,
    getRoot,
} from "../../controllers/user/getUserById";
import {
    updateAdmin,
    updateEmployee,
    updateRoot,
    updateSuperAdmin,
    updateUser,
} from "../../controllers/user/updateUser";
import { checkRole } from "../../middlewares/access";
import { authMiddleware } from "../../middlewares/auth";
import {
    checkCreationPrivilage,
    checkUpdatePrivilege,
} from "../../middlewares/checkPrivileges";
import checkUserFound from "../../middlewares/checkUserFound";
import { validator } from "../../middlewares/validator";
import { Roles } from "../../types/enums";
import {
    validateUserPost,
    validateUserPut,
} from "../../validators/user.validator";
import { getMe } from "../../controllers/user";
import { checkSubscribe } from "../../middlewares/subscription";


const userRouter = Router();
//(START)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT)
// to get all admins on company
userRouter
    .route("/admins/company/:company")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT),
        authAdminEmployee("admin", "get"),
        checkSubscribe,
    )
    .get(getAllAdminsInCompany);
userRouter.route("/me").all(authMiddleware, checkSubscribe).get(getMe);
// to get all admins on branch
userRouter
    .route("/admins/branch/:branch")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT),
        authAdminEmployee("admin", "get"),
        checkSubscribe,
    )
    .get(getAllAdminsInBranch);
// to get all admins on department
userRouter
    .route("/admins/department/:department")
    .all(
        authMiddleware,
        checkRole(Roles.ROOT),
        authAdminEmployee("admin", "get"),
        checkSubscribe,
    )
    .get(getAllEmployeesInDepartment);
userRouter
    .route("/admins")
    .all(authMiddleware, checkSubscribe)
    .get(
        checkRole(Roles.ROOT),
        authAdminEmployee("admin", "get"),
        getAllAdmins,
    )
    .post(
        checkRole(Roles.ROOT),
        validator(validateUserPost, "post"),
        authAdminEmployee("admin", "post"),
        checkUserFound,
        createAdmin,
    );


//(ADMIN,ROOT)
userRouter
    .route("/admins/:id")
    .all(authMiddleware, checkSubscribe)
    .get(
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        authAdminEmployee("admin", "get"),
        getAdmin,
    )
    .all(
        checkRole(Roles.ROOT),
        authAdminEmployee("admin", "put"),
        checkSubscribe,
    )
    .put(
        validator(validateUserPut, "put"),
        checkRole(Roles.ROOT, Roles.ADMIN),
        checkUserFound,
        updateAdmin,
    )
    .delete(checkRole(Roles.ROOT), deleteAdmin);
//(END)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT)

//(START)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT,EMPLOYEE,ADMIN)
// to get all empolyees on company
userRouter.route("/employees/getAllWithBranchAndDepartment/:companyId").get(authMiddleware,
    checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE), getAllEmployeesInTheCompanyWithBranchAndDepartment);
userRouter
    .route("/employees/company/:company")
    .all(
        authMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        authAdminEmployee("employee", "get"),
        checkSubscribe,
    )
    .get(getAllEmployeesInComapny);
// to get all empolyees on branch
userRouter
    .route("/employees/branch/:branch")
    .all(
        authMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        authAdminEmployee("employee", "get"),
        checkSubscribe,
    )
    .get(getAllEmployeesInBranch);
// to get all empolyees on department
userRouter
    .route("/employees/department/:department")
    .all(
        authMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        authAdminEmployee("employee", "get"),
        checkSubscribe,
    )
    .get(getAllEmployeesInDepartment);
// to get all employees on shift
userRouter
    .route("/employees/shift/:shift")
    .all(
        authMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        authAdminEmployee("employee", "get"),
        checkSubscribe,
    )
    .get(getAllEmployeesInShift);
userRouter
    .route("/employees")
    .all(authMiddleware, checkSubscribe, checkRole(Roles.ADMIN, Roles.ROOT))
    .get(getAllEmployees)
    .post(
        checkUserFound,
        validator(validateUserPost, "post"),
        authAdminEmployee("employee", "post"),
        createEmployee,
    );
userRouter
    .route("/employee/:id")
    .all(authMiddleware, checkSubscribe)
    .get(
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        authAdminEmployee("employee", "get"),
        getEmployee,
    )
    //(ADMIN,ROOT)
    .all(
        authMiddleware,
        checkRole(Roles.ROOT, Roles.ADMIN),
        checkSubscribe,
    )
    .put(
        validator(validateUserPut, "put"),
        authAdminEmployee("employee", "put"),
        checkUserFound,
        updateEmployee,
    )
    .delete(authAdminEmployee("employee", "delete"), deleteEmployee);
//(EMPLOYEE)
userRouter
    .route("/employee/infoCompany")
    .all(
        authMiddleware,
        checkRole(Roles.EMPLOYEE),
        authAdminEmployee("employee", "get"),
        checkSubscribe,
    )
    .get(getRootAndAdmin);
//(END)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT,EMPLOYEE,ADMIN)
userRouter
    .route("/superadmins")
    .all(authMiddleware, checkRole(Roles.SUPER_ADMIN))
    .get(getAllSuperAdmins)
    .post(validator(validateUserPost, "post"), checkUserFound, createSuperAdmin);
userRouter
    .route("/superadmins/:id")
    .all(authMiddleware, checkRole(Roles.SUPER_ADMIN))
    .get(getEmployee)
    .all(checkUpdatePrivilege)
    .patch(validator(validateUserPut, "put"), checkUserFound, updateSuperAdmin)
    .delete(deleteSuperAdmin);
userRouter
    .route("/roots")
    .all(authMiddleware, checkRole(Roles.SUPER_ADMIN))
    .get(getAllRoots);
// .post(checkRole(Roles.ADMIN, Roles.ROOT), checkUserFound, validator(validateUserPost,"post"), createRoot);
userRouter
    .route("/roots/:id")
    .all(authMiddleware)
    .get(getRoot, checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE, Roles.SUPER_ADMIN))
    .all(checkRole(Roles.SUPER_ADMIN), checkUpdatePrivilege)
    .patch(checkRole(Roles.ROOT), validator(validateUserPut, "put"), checkUserFound, updateRoot)
    .delete(checkRole(Roles.SUPER_ADMIN), deleteRoot);
userRouter
    .route("/me/")
    .all(authMiddleware, checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE, Roles.SUPER_ADMIN), checkUserFound,
        checkSubscribe)
    .get(getMe);

userRouter.route("/updateUser/:userId").put(authMiddleware,
    checkRole(Roles.ADMIN, Roles.EMPLOYEE, Roles.ROOT), updateUser);
userRouter.route("/:id").get(
    authMiddleware, checkSubscribe,
    checkRole(Roles.ADMIN, Roles.ROOT), getUser);
userRouter.route("/employees/getAllByRole").get(authMiddleware, checkRole(Roles.ADMIN, Roles.EMPLOYEE, Roles.ROOT),
    getAllEmpsBasedOnRole);

// this will take the branch and department as query 

export default userRouter;
