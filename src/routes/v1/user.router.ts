import { getUser } from './../../controllers/user/index';
import { createUser } from './../../controllers/user/createUser';
import { AuthuthrationAdminEmployee } from './../../middlewares/authuthrations/employee_admin.authuthration'
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
    getAllUsers,
} from './../../controllers/user/getAllUsers'
import { Router } from 'express'
import {
    createAdmin,
    createEmployee,
    createRoot,
    createSuperAdmin,
} from '../../controllers/user/createUser'
import {
    deleteAdmin,
    deleteEmployee,
    deleteRoot,
    deleteSuperAdmin,
    deleteUser,
} from '../../controllers/user/deleteUser'
import {
    getAllEmployees,
    getAllRoots,
    getAllSuperAdmins,
} from '../../controllers/user/getAllUsers'
import {
    getAdmin,
    getEmployee,
    getRoot,
} from '../../controllers/user/getUserById'
import {
    updateAdmin,
    updateEmployee,
    updateRoot,
    updateSuperAdmin,
    updateUser,
} from '../../controllers/user/updateUser'
import { checkRole } from '../../middlewares/acsses'
import { AuthenticationMiddleware } from '../../middlewares/auth'
import {
    checkCreationPrivilage,
    checkUpdatePrivilage,
} from '../../middlewares/checkPrivilages'
import checkUserFound from '../../middlewares/checkUserFound'
import { validator } from '../../middlewares/validate'
import { Roles } from '../../types/enums'
import {
    validateUserPost,
    validateUserPut,
} from '../../validators/userValidator'
import { getMe } from '../../controllers/user'
import { checkSubscripe } from '../../middlewares/subscription'
const userRouter = Router()
//(START)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT)
// to get all admins on company
userRouter
    .route('/admins/comapny/:company')
    .all(
        AuthenticationMiddleware,
        checkRole(Roles.ROOT),
        AuthuthrationAdminEmployee('admin', 'get'),
        checkSubscripe,
    )
    .get(getAllAdminsInCompany)
userRouter.route('/me').all(AuthenticationMiddleware, checkSubscripe).get(getMe)
// to get all admins on branch
userRouter
    .route('/admins/branch/:branch')
    .all(
        AuthenticationMiddleware,
        checkRole(Roles.ROOT),
        AuthuthrationAdminEmployee('admin', 'get'),
        checkSubscripe,
    )
    .get(getAllAdminsInBranch)
// to get all admins on department
userRouter
    .route('/admins/department/:department')
    .all(
        AuthenticationMiddleware,
        checkRole(Roles.ROOT),
        AuthuthrationAdminEmployee('admin', 'get'),
        checkSubscripe,
    )
    .get(getAllEmployeesInDepartment)
userRouter
    .route('/admins')
    .all(AuthenticationMiddleware, checkSubscripe)
    .get(
        checkRole(Roles.ROOT),
        AuthuthrationAdminEmployee('admin', 'get'),
        getAllAdmins,
    )
    .post(
        checkRole(Roles.ROOT),
        validator(validateUserPost, 'post'),
        AuthuthrationAdminEmployee('admin', 'post'),
        checkUserFound,
        createAdmin,
    )


//(ADMIN,ROOT)
userRouter
    .route('/admins/:id')
    .all(AuthenticationMiddleware, checkSubscripe)
    .get(
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        AuthuthrationAdminEmployee('admin', 'get'),
        getAdmin,
    )
    .all(
        checkRole(Roles.ROOT),
        AuthuthrationAdminEmployee('admin', 'put'),
        checkSubscripe,
    )
    .put(
        validator(validateUserPut, 'put'),
        checkRole(Roles.ROOT, Roles.ADMIN),
        checkUserFound,
        updateAdmin,
    )
    .delete(checkRole(Roles.ROOT), deleteAdmin)
//(END)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT)

//(START)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT,EMPLOYEE,ADMIN)
// to get all empolyees on company
userRouter.route('/employees/getAllWithBranchAndDepartment/:companyId').get(AuthenticationMiddleware, checkRole(Roles.ADMIN, Roles.ROOT ,Roles.EMPLOYEE),getAllEmployeesInTheCompanyWithBranchAndDepartment)
userRouter
    .route('/employees/company/:company')
    .all(
        AuthenticationMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        AuthuthrationAdminEmployee('employee', 'get'),
        checkSubscripe,
    )
    .get(getAllEmployeesInComapny)
// to get all empolyees on branch
userRouter
    .route('/employees/branch/:branch')
    .all(
        AuthenticationMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        AuthuthrationAdminEmployee('employee', 'get'),
        checkSubscripe,
    )
    .get(getAllEmployeesInBranch)
// to get all empolyees on department
userRouter
    .route('/employees/department/:department')
    .all(
        AuthenticationMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        AuthuthrationAdminEmployee('employee', 'get'),
        checkSubscripe,
    )
    .get(getAllEmployeesInDepartment)
// to get all empolyees on shift
userRouter
    .route('/employees/shift/:shift')
    .all(
        AuthenticationMiddleware,
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        AuthuthrationAdminEmployee('employee', 'get'),
        checkSubscripe,
    )
    .get(getAllEmployeesInShift)
userRouter
    .route('/employees')
    .all(AuthenticationMiddleware, checkSubscripe, checkRole(Roles.ADMIN, Roles.ROOT),)
    .get(getAllEmployees,)
    .post(
        checkUserFound,
        validator(validateUserPost, 'post'),
        AuthuthrationAdminEmployee('employee', 'post'),
        createEmployee,
    )
userRouter
    .route('/employee/:id')
    .all(AuthenticationMiddleware, checkSubscripe)
    .get(
        checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE),
        AuthuthrationAdminEmployee('employee', 'get'),
        getEmployee,
    )
    //(ADMIN,ROOT)
    .all(
        AuthenticationMiddleware,
        checkRole(Roles.ROOT, Roles.ADMIN),
        checkSubscripe,
    )
    .put(
        validator(validateUserPut, 'put'),
        AuthuthrationAdminEmployee('employee', 'put'),
        checkUserFound,
        updateEmployee,
    )
    .delete(AuthuthrationAdminEmployee('employee', 'delete'), deleteEmployee)
//(EMPLOYEE)
userRouter
    .route('/employee/infoCompany')
    .all(
        AuthenticationMiddleware,
        checkRole(Roles.EMPLOYEE),
        AuthuthrationAdminEmployee('employee', 'get'),
        checkSubscripe,
    )
    .get(getRootAndAdmin)
//(END)________----_____-----_____ :> WHO CAN ACCESS ON THIS ROUTES : > ________----_____-----_____ (ROOT,EMPLOYEE,ADMIN)
userRouter
    .route('/superadmins')
    .all(AuthenticationMiddleware, checkRole(Roles.SUPER_ADMIN))
    .get(getAllSuperAdmins)
    .post(createSuperAdmin)
userRouter
    .route('/superadmins/:id')
    .all(AuthenticationMiddleware, checkRole(Roles.SUPER_ADMIN))
    .get(getEmployee)
    .all(checkUpdatePrivilage)
    .patch(validator(validateUserPut, 'put'), checkUserFound, updateSuperAdmin)
    .delete(deleteSuperAdmin)
userRouter
    .route('/roots')
    .all(AuthenticationMiddleware, checkRole(Roles.SUPER_ADMIN))
    .get(getAllRoots)
// .post(checkRole(Roles.ADMIN, Roles.ROOT), checkUserFound, validator(validateUserPost,"post"), createRoot);
userRouter
    .route('/roots/:id')
    .all(AuthenticationMiddleware)
    .get(getRoot, checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE, Roles.SUPER_ADMIN))
    .all(checkRole(Roles.SUPER_ADMIN), checkUpdatePrivilage)
    .patch(checkRole(Roles.ROOT), validator(validateUserPut, 'put'), checkUserFound, updateRoot)
    .delete(checkRole(Roles.SUPER_ADMIN), deleteRoot)
userRouter
    .route('/me/')
    .all(AuthenticationMiddleware, checkRole(Roles.ADMIN, Roles.ROOT, Roles.EMPLOYEE, Roles.SUPER_ADMIN), checkUserFound, checkSubscripe)
    .get(getMe,)

userRouter.route('/updateUser/:userId').put(AuthenticationMiddleware,
    checkRole(Roles.ADMIN, Roles.EMPLOYEE, Roles.ROOT), updateUser)
    userRouter.route('/:id').get(       
 AuthenticationMiddleware,  checkSubscripe,
        checkRole(Roles.ADMIN, Roles.ROOT), getUser)
userRouter.route('/employees/getAllByRole').get(AuthenticationMiddleware, checkRole(Roles.ADMIN, Roles.EMPLOYEE, Roles.ROOT), getAllEmpsBasedOnRole)

// this will take the branch and department as query 

// SUPER ADMIN 
userRouter.route('/').all(AuthenticationMiddleware,checkRole(Roles.SUPER_ADMIN)).get(getAllUsers),
userRouter.route('/:id').all(AuthenticationMiddleware,checkRole(Roles.SUPER_ADMIN)).delete(deleteUser)
export default userRouter
