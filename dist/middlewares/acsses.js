"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (...roles) => (req, res, next) => {
    var _a, _b, _c;
    console.log('the commingRoles; ', roles, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role, req.originalUrl);
    console.log('userRole; ', (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.role, !roles.includes(req.user.role));
    if (!roles.includes((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.role)) {
        return res.status(403).send('Access Forbidden!!');
    }
    else
        next();
    // if (!roles.includes((req as AuthenticatedReq).user!.role)) {
    // }
    // next();
};
exports.checkRole = checkRole;
