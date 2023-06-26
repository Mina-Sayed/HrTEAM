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
exports.deleteBranch = exports.updateBranch = exports.getBranch = exports.getAllBranchesWithData = exports.getAllBranches = exports.addBranch = void 0;
const Branch_1 = require("../../models/Branch");
const Department_1 = require("../../models/Department");
const Shift_1 = require("../../models/Shift");
const attendenc_model_1 = require("../../models/attendenc.model");
const payrol_1 = __importDefault(require("../../models/payrol"));
const Contract_1 = __importDefault(require("../../models/Contract"));
const Request_1 = __importDefault(require("../../models/Request"));
const User_1 = __importDefault(require("../../models/User"));
const task_1 = __importDefault(require("../../models/task"));
const enums_1 = require("../../types/enums");
//@desc         create a branch
//@route        POST /api/v1/branch
//@access       private(root)
const addBranch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lat, long, company, weeklyHolidays, fixedHolidays } = req.body;
    //I:must check the company, his want add branch in it , he has this the company
    // const companyValid = await Company.find({ owner: ownerId, _id: company })
    // if (!companyValid[0]) return res.status(400).send({ error_en: "You cannot add a branch in this company because you are not the owner of the company" })
    //IV:must the name branch be unique
    const uniqueBranch = yield Branch_1.Branch.findOne({
        name: name,
        company: company,
        location: {
            lat,
            long
        }
    });
    console.log(uniqueBranch);
    if (uniqueBranch)
        return res
            .status(400)
            .send({ error_en: 'The branch with the given NAME used befor' });
    const branch = new Branch_1.Branch({
        name: name,
        company: company ? company : req.params.company,
        location: {
            lat: lat,
            long: long,
        },
    });
    yield branch.save();
    res.send({
        success: true,
        data: branch,
        message_en: 'Branch is created successfully',
    });
});
exports.addBranch = addBranch;
//@desc         get all branches in company
//@route        GET /api/v1/branch
//@access       private(root)
const getAllBranches = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //I:must check the company, his want fetched branches in it , he has this the company
    // const companyValid = await Company.find({ owner: ownerId, _id: req.params.company })
    // if (!companyValid[0]) return res.status(400).send({ error_en: "You cannot get any branch in this company because you are not the owner of the company" })
    let branches;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === enums_1.Roles.EMPLOYEE) {
        branches = yield Branch_1.Branch.find({
            _id: req.user.branch,
        });
    }
    else {
        branches = yield Branch_1.Branch.find({ company: req.params.company });
    }
    for (let index = 0; index < branches.length; index++) {
        // to get employees in this branch
        // !branches[index].emp[0]
        //   ? branches[index].emp.push(
        //       ...(await User.find({
        //         branch: branches[index]._id,
        //         role: 'employee',
        //       })),
        //     )
        //   : branches[index].emp
        //to get departments in this branch
        !branches[index].deps[0]
            ? branches[index].deps.push(...(yield Department_1.Department.find({ branch: branches[index]._id })))
            : branches[index].deps;
        if (index === branches.length - 1) {
            res.send({
                success: true,
                data: branches,
                message_en: 'Branches are fetched successfully',
            });
        }
    }
    // console.log(branches);
    // console.log(branches);
});
exports.getAllBranches = getAllBranches;
//@desc         get all branches in company
//@route        GET /api/v1/branch
//@access       private(root)
const getAllBranchesWithData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    //I:must check the company, his want fetched branches in it , he has this the company
    // const companyValid = await Company.find({ owner: ownerId, _id: req.params.company })
    // if (!companyValid[0]) return res.status(400).send({ error_en: "You cannot get any branch in this company because you are not the owner of the company" })
    let branches;
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === enums_1.Roles.EMPLOYEE) {
        branches = yield Branch_1.Branch.find({
            _id: req.user.branch,
        });
    }
    else {
        branches = yield Branch_1.Branch.find({ company: req.params.company });
    }
    // to get employees in this branch
    // !branches[index].emp[0]
    //   ? branches[index].emp.push(
    //       ...(await User.find({
    //         branch: branches[index]._id,
    //         role: 'employee',
    //       })),
    //     )
    //   : branches[index].emp
    //to get departments in this branch
    res.send({
        success: true,
        data: branches,
        message_en: 'Branches are fetched successfully',
    });
    // console.log(branches);
    // console.log(branches);
});
exports.getAllBranchesWithData = getAllBranchesWithData;
//@desc         get details branch in company
//@route        GET /api/v1/branch/:comapny/:name
//@access       private(root)
const getBranch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //I:must check the company, his want get branch in it , he has this the company
    // const companyValid = await Company.find({ owner: ownerId, _id: req.params.company })
    // if (!companyValid[0]) return res.status(400).send({ error_en: "You cannot get any branch in this company because you are not the owner of the company" })
    //II:chake the branch found with company
    const branch = yield Branch_1.Branch.findOne({
        company: req.params.company,
        _id: req.params.id,
    });
    console.log('whre is the funcking dpes', branch);
    if (!branch)
        return res.status(400).send({ error_en: 'Invalid branch!!' });
    res.send({
        success: true,
        data: branch,
        message_en: 'Branch is fetched successfully',
    });
});
exports.getBranch = getBranch;
//@desc         update a branch
//@route        PUT /api/v1/branch/:company/:id
//@access       private(root)
const updateBranch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { name, lat, long, fixedHolidays } = req.body;
    const branch = yield Branch_1.Branch.findOne({
        company: req.params.company,
        _id: req.params.id,
    });
    if (!branch)
        return res.status(400).send({ error_en: 'Invalid branch!!' });
    //III:must the name branch be unique
    // a7a ya abdo branch unique with name not the id 
    const uniqueBranch = yield Branch_1.Branch.findOne({
        comapny: req.params.company,
        name: req.body.name
    });
    if (uniqueBranch)
        return res
            .status(400)
            .send({ error_en: 'The branch with the given ID used befor' });
    yield Branch_1.Branch.updateOne({ company: req.params.company, _id: req.params.id }, {
        $set: {
            name: name.toLowerCase(),
            location: {
                lat: lat ? lat : branch.location.lat,
                long: long ? long : (_c = branch.location) === null || _c === void 0 ? void 0 : _c.long,
            },
        },
        $push: {
            fixedHolidays: fixedHolidays &&
                fixedHolidays.map((days) => {
                    return days;
                }),
        },
    });
    const newB = yield Branch_1.Branch.findOne({
        company: req.params.company,
        _id: req.params.id,
    });
    res.send({
        success: true,
        data: newB,
        message_en: 'Branch is updated successfully',
    });
});
exports.updateBranch = updateBranch;
//@desc         delete a branch
//@route        DELETE /api/v1/branch/:company/:id
//@access       private(root)
const deleteBranch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const branch = yield Branch_1.Branch.findOne({
        company: req.params.company,
        _id: req.params.id,
    });
    if (!branch)
        return res.status(400).send({ error_en: 'Invalid branch!!', error_ar: 'فرع غير صالح !!' });
    // if (branch?.clicked === 0) {
    //   await Branch.updateOne({ clicked: 1 })
    //   return res.send({
    //     message_en:
    //       'If you want delete the branch must know you will lose all your data in the barach like the employees , shifts , departments , contracts , payrolls',
    //     message_ar:
    //       'إذا كنت ترغب في حذف الشركة ، يجب أن تعلم أنك ستفقد جميع بياناتك في الفرع مثل الموظفين ، ورديات العمل ، والإدارات',
    //   })
    // }
    yield Department_1.Department.deleteMany({ branch: req.params.id });
    yield Shift_1.Shift.deleteMany({ branch: req.params.id });
    yield attendenc_model_1.Attendance.deleteMany({ branch: req.params.id });
    yield Request_1.default.deleteMany({ branch: req.params.id });
    yield payrol_1.default.deleteMany({ branch: req.params.id });
    yield Contract_1.default.deleteMany({ branch: req.params.id });
    yield Branch_1.Branch.deleteMany({ _id: req.params.id });
    yield User_1.default.deleteMany({ branch: req.params.id });
    yield task_1.default.deleteMany({ branch: req.params.id });
    res.send({
        success: true,
        message_en: 'Branch  deleted successfully',
    });
});
exports.deleteBranch = deleteBranch;
