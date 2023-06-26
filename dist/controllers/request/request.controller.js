"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = exports.updateRequest = exports.getRequestById = exports.getAllSend = exports.getAllReceive = exports.getAllAlerts = exports.getAllRequests = exports.addRequest = void 0;
const mongodb_1 = require("mongodb");
const enums_1 = require("./../../types/enums");
const Company_1 = require("../../models/Company");
const Department_1 = require("../../models/Department");
const Branch_1 = require("../../models/Branch");
const Request_1 = __importDefault(require("../../models/Request"));
const SubCategory_1 = __importDefault(require("../../models/SubCategory"));
const User_1 = __importDefault(require("../../models/User"));
//@Desc:    Create Request
//@router:  POST temaHR/api/v1/request
const addRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const { title, description, from, to, startDate, endDate, ids } = req.body;
    console.log(title);
    //III: must check the sub category if exites or not
    const checkTitle = mongodb_1.ObjectId.isValid(title);
    let subCategory = !checkTitle
        ? { haveTime: false, subType: title }
        : yield SubCategory_1.default.findById(title);
    console.log(subCategory, "dsadsadsadsadsa");
    if (!subCategory && checkTitle)
        return res.status(400).send({
            error_en: 'Invalid Sub Category',
            error_ar: 'فئة فرعية غير صالحة',
        });
    console.log(startDate);
    //II: check if have time or not
    if ((!startDate || !endDate) &&
        subCategory.haveTime &&
        ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === enums_1.Roles.EMPLOYEE)
        return res
            .status(400)
            .send({ error_en: 'The time start and end for request is required ' });
    //I: must know who is send the request to take action about this
    const user = yield User_1.default.findOne({ _id: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
    const requstes = [];
    if (user.role === 'employee') {
        const getRequset = yield Request_1.default.findOne({
            title: title,
            from: user._id,
            status: false,
            type: 'request',
        });
        const data = {
            title: subCategory.subType,
            from: user._id,
            description: description,
            company: user.company,
            branch: user.branch,
            department: user.department,
            startDate: startDate,
            endDate: endDate,
            type: 'request',
            status: false,
        };
        !getRequset && requstes.push(data);
        // const requset = await Request.insertMany(requstes)
        // const newRequest  =  Request.cre()
    }
    if (user.role === 'admin' || user.role === 'root') {
        const company = yield Company_1.Company.findOne({ _id: to });
        const branch = yield Branch_1.Branch.findOne({ _id: to });
        const department = yield Department_1.Department.findOne({ _id: to });
        const user = yield User_1.default.find({ _id: ids });
        if (!to && !ids)
            return res.status(400).send({ error_en: 'the employes are requierd' });
        // for send the requset an employee
        if (user[0]) {
            const employes = (yield User_1.default.find({
                _id: ids,
            })).map((employee) => employee);
            for (let index = 0; index < employes.length; index++) {
                const employee = employes[index];
                const getRequset = yield Request_1.default.findOne({
                    title: title,
                    to: employee._id,
                    from: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
                    type: ((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) === enums_1.Roles.ROOT ? 'alert' : 'request',
                });
                const data = {
                    title: subCategory.subType,
                    to: employee._id,
                    from: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id,
                    company: employee.company,
                    branch: employee.branch,
                    department: employee.department,
                    description: description,
                    startDate: startDate,
                    endDate: endDate,
                    type: ((_f = req.user) === null || _f === void 0 ? void 0 : _f.role) === enums_1.Roles.ROOT ? 'alert' : 'request',
                };
                !getRequset && requstes.push(data);
            }
        }
        if (to) {
            // for send the requset to all employees in branch
            if (branch) {
                const employes = (yield User_1.default.find({
                    branch: branch._id,
                })).map((employee) => employee);
                for (let index = 0; index < employes.length; index++) {
                    const employee = employes[index];
                    const getRequset = yield Request_1.default.findOne({
                        title,
                        to: employee._id,
                        from: (_g = req.user) === null || _g === void 0 ? void 0 : _g._id,
                        status: false,
                    });
                    const data = {
                        title: subCategory.subType,
                        to: employee._id,
                        company: employee.company,
                        branch: employee.branch,
                        department: employee.department,
                        from: (_h = req.user) === null || _h === void 0 ? void 0 : _h._id,
                        description: description,
                        startDate: subCategory.haveTime || title ? startDate : undefined,
                        endDate: subCategory.haveTime || title ? endDate : undefined,
                        type: ((_j = req.user) === null || _j === void 0 ? void 0 : _j.role) === enums_1.Roles.ROOT ? 'alert' : 'request',
                    };
                    !getRequset && requstes.push(data);
                }
            }
            // for send the requset to all employees in department
            if (department) {
                const employes = (yield User_1.default.find({
                    department: department._id,
                })).map((employee) => employee);
                for (let index = 0; index < employes.length; index++) {
                    const employee = employes[index];
                    const getRequset = yield Request_1.default.findOne({
                        title,
                        to: employee._id,
                        from: (_k = req.user) === null || _k === void 0 ? void 0 : _k._id,
                        status: false,
                    });
                    const data = {
                        title: subCategory.subType,
                        to: employee._id,
                        company: employee.company,
                        branch: employee.branch,
                        department: employee.department,
                        from: (_l = req.user) === null || _l === void 0 ? void 0 : _l._id,
                        description: description,
                        startDate: subCategory.haveTime || title ? startDate : undefined,
                        endDate: subCategory.haveTime || title ? endDate : undefined,
                        type: ((_m = req.user) === null || _m === void 0 ? void 0 : _m.role) === enums_1.Roles.ROOT ? 'alert' : 'request',
                    };
                    !getRequset && requstes.push(data);
                }
            }
            // for send the requset to all employees in company
            if (company) {
                const employes = (yield User_1.default.find({
                    company: company._id,
                })).map((employee) => employee);
                for (let index = 0; index < employes.length; index++) {
                    const employee = employes[index];
                    const getRequset = yield Request_1.default.findOne({
                        title,
                        to: employee._id,
                        from: (_o = req.user) === null || _o === void 0 ? void 0 : _o._id,
                        status: false,
                    });
                    const data = {
                        title: subCategory.subType,
                        to: employee._id,
                        from: (_p = req.user) === null || _p === void 0 ? void 0 : _p._id,
                        company: employee.company,
                        branch: employee.branch,
                        department: employee.department,
                        description: description,
                        startDate: subCategory.haveTime || title ? startDate : undefined,
                        endDate: subCategory.haveTime || title ? endDate : undefined,
                        type: ((_q = req.user) === null || _q === void 0 ? void 0 : _q.role) === enums_1.Roles.ROOT ? 'alert' : 'request',
                    };
                    !getRequset && requstes.push(data);
                }
            }
            // if the ID IS Wrong
            if (!user && !company && !department && !branch) {
                return res
                    .status(400)
                    .send({ error_en: "can't get any thing with the given ID" });
            }
        }
    }
    const requset = yield Request_1.default.insertMany(requstes);
    if (!requset[0])
        return res.status(400).send({
            error_en: 'You already send the request befor',
            error_ar: 'لقد ارسلت الطلب من قبل ',
        });
    res.status(200).send({
        data: requset,
        message_en: 'Request is created succesfuly ',
    });
});
exports.addRequest = addRequest;
//@Desc: get All The Requests
//@route: get api/v1/request
const getAllRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _r, _s, _t, _u, _v;
    let requests;
    const { company, branch, department } = req.query;
    if (((_r = req.user) === null || _r === void 0 ? void 0 : _r.role) === enums_1.Roles.EMPLOYEE) {
        requests = yield Request_1.default.find({
            type: 'requset',
            branch: req.user.branch.toString(),
            company: req.user.company.toString(),
            department: req.user.department.toString(),
            $or: [
                {
                    to: req.user._id,
                },
                {
                    from: req.user._id,
                },
            ],
        }).populate('from to');
    }
    if (((_s = req.user) === null || _s === void 0 ? void 0 : _s.role) === 'admin' || ((_t = req.user) === null || _t === void 0 ? void 0 : _t.role) === 'root') {
        if (!company && !department && !branch)
            return res.status(400).send({
                error_en: 'please select company or branch or department to get requests and alerts',
            });
        const adminsAndOwners = (yield User_1.default.find({
            company: ((_u = req.user) === null || _u === void 0 ? void 0 : _u.company)
                ? (_v = req.user) === null || _v === void 0 ? void 0 : _v.company.toString()
                : req.query.company,
            role: ['admin', 'root'],
        })).map((admin) => admin._id);
        requests = yield Request_1.default.find({
            type: 'requset',
            $or: [
                {
                    company: company,
                },
                {
                    branch: branch,
                },
                {
                    department: department,
                },
                {
                    from: adminsAndOwners,
                },
                {
                    to: adminsAndOwners,
                },
            ],
        }).populate('from to');
    }
    if (!requests[0])
        return res.status(400).send({ error_en: 'No Request has been made yet' });
    res.status(200).send({
        message: 'Requests Fetched Succesfuly',
        requests: requests,
    });
});
exports.getAllRequests = getAllRequests;
const getAllAlerts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _w, _x, _y, _z, _0;
    let alerts;
    const { company, branch, department } = req.query;
    if (((_w = req.user) === null || _w === void 0 ? void 0 : _w.role) === enums_1.Roles.EMPLOYEE) {
        alerts = yield Request_1.default.find({
            type: 'alert',
            $or: [
                {
                    to: req.user._id,
                },
            ],
        }).populate('from to');
    }
    if (((_x = req.user) === null || _x === void 0 ? void 0 : _x.role) === 'admin' || ((_y = req.user) === null || _y === void 0 ? void 0 : _y.role) === 'root') {
        if (!company && !department && !branch)
            return res.status(400).send({
                error_en: 'please select company or branch or department to get requests and alerts',
            });
        const adminsAndOwners = (yield User_1.default.find({
            company: ((_z = req.user) === null || _z === void 0 ? void 0 : _z.company)
                ? (_0 = req.user) === null || _0 === void 0 ? void 0 : _0.company.toString()
                : req.query.company,
            role: ['admin', 'root'],
        })).map((admin) => admin._id);
        alerts = yield Request_1.default.find({
            type: 'alert',
            $or: [
                {
                    company: company,
                },
                {
                    branch: branch,
                },
                {
                    department: department,
                },
            ],
        }).populate('from to');
    }
    if (!alerts[0])
        return res.status(400).send({ error_en: 'No Alerts has been made yet' });
    res.status(200).send({
        message: 'Requests Fetched Succesfuly',
        alerts: alerts,
    });
});
exports.getAllAlerts = getAllAlerts;
//@Desc: get All The Requests Receive
//@route: get api/v1/request/receive
const getAllReceive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _1, _2, _3;
    let requests;
    const { company, branch, department } = req.query;
    if (((_1 = req.user) === null || _1 === void 0 ? void 0 : _1.role) === 'employee') {
        requests = yield Request_1.default.find({
            to: req.user._id,
            type: 'request',
        }).populate('from to');
        console.log(requests);
    }
    if (((_2 = req.user) === null || _2 === void 0 ? void 0 : _2.role) === 'admin' || ((_3 = req.user) === null || _3 === void 0 ? void 0 : _3.role) === 'root') {
        if (!company && !department && !branch)
            return res.status(400).send({
                error_en: 'please select company or branch or department to get requests and alerts',
            });
        requests = yield Request_1.default.find({
            $or: [
                {
                    company: company,
                    to: undefined,
                },
                {
                    branch: branch,
                },
                {
                    department: department,
                },
            ],
            type: 'request',
        }).populate('from to');
    }
    if (!requests[0])
        return res.status(400).send({ error_en: 'No Request has been made yet' });
    res.status(200).send({
        message: 'Requests Fetched Succesfuly',
        requests: requests,
    });
});
exports.getAllReceive = getAllReceive;
//@Desc: get All The Requests sent
//@route: get api/v1/request/send
const getAllSend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _4, _5;
    let requests = [];
    const { company, branch, department } = req.query;
    if (((_4 = req.user) === null || _4 === void 0 ? void 0 : _4.role) === 'employee') {
        requests = yield Request_1.default.find({
            from: req.user._id,
            $or: [
                {
                    company: company,
                },
                {
                    branch: branch,
                },
                {
                    department: department,
                },
            ],
            type: 'request',
        }).populate('from to');
    }
    if (((_5 = req.user) === null || _5 === void 0 ? void 0 : _5.role) === 'admin') {
        if (!company && !department && !branch)
            return res.status(400).send({
                error_en: 'please select company or branch or department to get requests and alerts',
            });
        const adminsAndOwners = (yield User_1.default.find({
            company: company,
            role: ['admin', 'root'],
        })).map((admin) => admin._id.toString());
        console.log(adminsAndOwners);
        requests = yield Request_1.default.find({
            from: adminsAndOwners,
            $or: [
                {
                    company: company,
                },
                {
                    branch: branch,
                },
                {
                    department: department,
                },
            ],
            type: 'request',
        }).populate('from to');
    }
    // if (req.user?.role === 'root') {
    //   if (!company && !department && !branch)
    //     return res.status(400).send({
    //       error_en:
    //         'please select company or branch or department to get requests and alerts',
    //     })
    //   requests = await Request.find({
    //     type: 'requset',
    //     from: req.user._id,
    //     $or: [
    //       {
    //         company: company,
    //       },
    //       {
    //         branch: branch,
    //       },
    //       {
    //         department: department,
    //       },
    //     ],
    //   }).populate('from to')
    // }
    if (!requests[0])
        return res.status(400).send({ error_en: 'No Request has been made yet' });
    res.status(200).send({
        message: 'Requests Fetched Succesfuly',
        requests: requests,
    });
});
exports.getAllSend = getAllSend;
//@Desc:    Get Request By Id
//@Route:   GET api/v1/request/:id
const getRequestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    // check if the request exist or not
    const request = yield Request_1.default.findById(id).populate('from to', 'fullName_ar fullName_en image');
    if (!request)
        return res.status(404).send({ error_en: 'Request Not Found' });
    res.status(200).send({ message: 'Request Fetched Succesfuly', data: request });
});
exports.getRequestById = getRequestById;
//@Desc update Request
//@Route : put api/v1/request/:id
const updateRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(req.body);
    // check if the request exist or not
    const isRequestExist = yield Request_1.default.findById(id);
    if (!isRequestExist)
        return res
            .status(400)
            .send({ error_en: 'The Request has not been made Yet' });
    const updatedRequest = yield Request_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
    res.status(200).send({
        success: true,
        message_en: 'Request updated Succesfuly',
        data: updatedRequest,
    });
});
exports.updateRequest = updateRequest;
//@Desc Delete Request
//@Route : Delete api/v1/request/:id
const deleteRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _6, _7, _8;
    const id = req.params.id;
    // check if the request exist or not
    console.log('requestId; ', id);
    const isRequestExist = yield Request_1.default.findById(id);
    console.log('request: ', isRequestExist);
    if (!isRequestExist)
        return res.status(400).send({ error_en: 'Request Not Found' });
    console.log('====================', (_6 = req === null || req === void 0 ? void 0 : req.user) === null || _6 === void 0 ? void 0 : _6._id, isRequestExist === null || isRequestExist === void 0 ? void 0 : isRequestExist.from);
    if (isRequestExist && ((_7 = req === null || req === void 0 ? void 0 : req.user) === null || _7 === void 0 ? void 0 : _7.role) == 'employee' && ((_8 = req === null || req === void 0 ? void 0 : req.user) === null || _8 === void 0 ? void 0 : _8._id.toString()) != (isRequestExist === null || isRequestExist === void 0 ? void 0 : isRequestExist.from.toString())) {
        return res.status(400).send({ error_en: "Cant Delete the Request ", error_ar: "Cant Delete the Request" });
    }
    const deletedRequest = yield Request_1.default.findByIdAndDelete(id);
    console.log(deletedRequest);
    res
        .status(200)
        .send({ success: true, message: 'Requset is Deleted Succesfuly' });
});
exports.deleteRequest = deleteRequest;
