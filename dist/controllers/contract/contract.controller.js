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
exports.getUserContract = exports.toggelGetContract = exports.deleteContract = exports.updateContract = exports.addContract = exports.getContractById = exports.getAllContract = void 0;
const Branch_1 = require("../../models/Branch");
const Company_1 = require("../../models/Company");
const Contract_1 = __importDefault(require("../../models/Contract"));
const enums_1 = require("../../types/enums");
//@DESC : Get all Contracts
//@Route :GET  /teamHR/api/v1/contract/all/:company
//@access       private(root,admin)
const getAllContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const company = yield Company_1.Company.findOne({ _id: req.params.company });
    if (!company)
        return res.status(400).send({ error_en: 'Invalid Company' });
    let contracts;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === enums_1.Roles.EMPLOYEE) {
        contracts = yield Contract_1.default.findOne({ employee: req.user._id }).populate('employee');
    }
    else {
        const AllBranches = (yield Branch_1.Branch.find({ company: company._id.toString() })).map((branch) => branch._id.toString());
        contracts = yield Contract_1.default.find({ branch: AllBranches }).populate('employee');
    }
    if (contracts.length == 0) {
        return res
            .status(400)
            .send({ success: false, message_en: 'Contracts Not Found' });
    }
    return res.status(200).send({
        success: true,
        message_en: 'Fetching Contracts Succesfuly',
        contracts,
    });
});
exports.getAllContract = getAllContract;
//@DESC: Get Contract By Id
//@Route : GET /teamHR/api/v1/contract/:id
//@access       private(root,admin)
const getContractById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const contract = yield Contract_1.default.findById(id).populate('employee', 'fullName_en fullName_ar');
    if (!contract)
        res.status(400).send({ success: false, message_en: 'Contract Not Found' });
    res.status(200).send({
        success: true,
        message_en: 'Contract Fetched Succesfully',
        contract,
    });
});
exports.getContractById = getContractById;
//@DESC : ADD Contract
//@Route : POST /teamHR/api/v1/contract
//@access       private(root,admin)
const addContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if contact already exist
    let { duration, salary, startDate, startStay, durationStay } = req.body;
    // change the entered from string to Date
    if (typeof startDate === 'string')
        startDate = new Date(startDate);
    const contractExist = yield Contract_1.default.findOne({ employee: req.body.employee });
    if (contractExist)
        return res
            .status(400)
            .send({ success: false, message_en: 'Contract  Already Exist' });
    // adding new employee
    const newContract = new Contract_1.default(Object.assign({}, req.body));
    // changing the salary of the employee in the contractor
    newContract.dailySalary = newContract.getDailySalary(salary, duration);
    // calculating the endDate for the contract
    newContract.endDate = newContract.getEndDate(startDate, duration);
    newContract.endStay = newContract.getEndDate(startStay, durationStay);
    yield newContract.save();
    res.status(200).send({
        success: true,
        message_en: 'Contract Added Succesfully',
        data: newContract,
    });
});
exports.addContract = addContract;
//@Desc : update Contract
//@Route : PUT /teamHR/api/v1/contract/:id
//@access       private(root,admin)
const updateContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { duration, salary, startDate, durationStay, startStay } = req.body;
    const id = req.params.id;
    // check to see if the contract already exist or not
    const existedContract = yield Contract_1.default.findById(id);
    if (!existedContract)
        return res
            .status(400)
            .send({ success: false, error_en: 'Contract Does Not Exist Yet ' });
    const updatedContract = yield Contract_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true }).populate('employee', 'fullName_en fullName_ar');
    if (updatedContract != undefined) {
        // check if he changed the duration
        if (duration) {
            updatedContract.endDate = updatedContract.getEndDate(startDate, duration);
            updatedContract.dailySalary = updatedContract.getDailySalary(salary, startDate);
        }
        if (durationStay) {
            updatedContract.endStay = updatedContract.getEndDate(startStay, durationStay);
        }
        yield (updatedContract === null || updatedContract === void 0 ? void 0 : updatedContract.save());
        res.status(200).send({
            success: true,
            message_en: 'Updated Contract Succesfully',
            contract: updatedContract,
        });
    }
});
exports.updateContract = updateContract;
//@Desc: Delete Contract
//@Route : Delete /teamHR/api/v1/contract/:id
//@access       private(root,admin)
const deleteContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('contractID : ===========================================');
    const id = req.params.id;
    const existedContract = yield Contract_1.default.findById(id);
    if (!existedContract)
        return res
            .status(400)
            .send({ success: false, error_en: 'Contract Does Not Exist' });
    yield Contract_1.default.findByIdAndDelete(id);
    res
        .status(200)
        .send({ sucess: true, message_en: 'Contract Deleted Succesfuly' });
});
exports.deleteContract = deleteContract;
//@Desc: get filter Contract
//@Route : GET /teamHR/api/v1/contract/all/filter/
//@access       private(root,admin)
const toggelGetContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const { department, branch } = req.query;
    let contracts = [];
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === enums_1.Roles.EMPLOYEE) {
        contracts = yield Contract_1.default.find({ employee: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id }).populate([
            { path: 'employee', model: 'User' },
        ]);
    }
    else {
        const branches = (yield Branch_1.Branch.find({ company: req.params.company })).map((branch) => branch._id.toString());
        // get All Contract by branches when there is no query
        let filterationOption = Object.keys(req.query).length > 0
            ? Object.assign({}, req.query) : {
            branch: { $in: [...branches] },
        };
        contracts = yield Contract_1.default.find(filterationOption).populate([
            { path: 'employee', model: 'User' },
        ]);
    }
    if (contracts.length == 0) {
        return res
            .status(400)
            .send({ success: false, message_en: 'Contracts Not Found' });
    }
    res.status(200).send({
        success: true,
        message_en: 'Fetching Contracts Succesfuly',
        contracts,
    });
});
exports.toggelGetContract = toggelGetContract;
const getUserContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    let option = req.params.userId ? req.params.userId : (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d._id;
    const contract = yield Contract_1.default.findOne({ employee: option }).populate([
        {
            path: 'employee',
            model: 'User',
            populate: {
                path: 'shift',
                model: 'shift',
                select: { time: 1, name: 1 },
            },
        },
        { path: 'branch', model: 'Branches', select: { name: 1 } },
        { path: 'department', model: 'Departments', select: { name: 1 } },
    ]);
    if (!contract) {
        return res
            .status(400)
            .send({
            error_en: 'Cant Find Any Contract For You',
            error_ar: 'ليس لديك عقد',
        });
    }
    res
        .status(200)
        .send({
        success_en: 'Contract Is Fetched Successfully',
        success_ar: ' تم جلب عقدك بنجاح',
        contract,
    });
});
exports.getUserContract = getUserContract;
