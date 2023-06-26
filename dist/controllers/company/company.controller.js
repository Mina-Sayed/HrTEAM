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
exports.deleteCompanyById = exports.updateCompanyByName = exports.getCompanyByName = exports.getOwnerCompanies = exports.addCompany = void 0;
const Company_1 = require("../../models/Company");
const Subscription_1 = __importDefault(require("../../models/Subscription"));
const User_1 = __importDefault(require("../../models/User"));
const Branch_1 = require("../../models/Branch");
const Department_1 = require("../../models/Department");
const Shift_1 = require("../../models/Shift");
const attendenc_model_1 = require("../../models/attendenc.model");
const Request_1 = __importDefault(require("../../models/Request"));
const payrol_1 = __importDefault(require("../../models/payrol"));
const Contract_1 = __importDefault(require("../../models/Contract"));
const notification_model_1 = require("../../models/notification.model");
const blog_model_1 = __importDefault(require("../../models/blog.model"));
const task_1 = __importDefault(require("../../models/task"));
const subTask_1 = __importDefault(require("../../models/subTask"));
const Category_1 = __importDefault(require("../../models/Category"));
//@desc         create a company
//@route        POST /api/v1/company
//@access       private(root) 
const addCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name } = req.body;
    const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // get subscripe
    const subscription = yield Subscription_1.default.findOne({ subscriber: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
    console.log(subscription);
    //I:must check how companies the root can added
    console.log('subcription: form the owner: ', ownerId);
    const companies = yield Company_1.Company.find({ owner: ownerId });
    if ((subscription === null || subscription === void 0 ? void 0 : subscription.companiesAllowed) == companies.length)
        return res.status(400).send({
            error_en: "You can't add more of compines becuse You have exceeded the limit of your Companies Allowed",
            error_ar: 'لا يمكنك إضافة المزيد من المجموعات لأنك تجاوزت الحد المسموح به لشركاتك'
        });
    //IV:must the name company be unique
    const nameCo = yield Company_1.Company.findOne({ owner: ownerId, name: name });
    if (nameCo)
        return res
            .status(400)
            .send({ error_en: 'The company with the given NAME used befor' });
    const company = new Company_1.Company({
        owner: ownerId,
        name: name,
    });
    res.send({
        success: true,
        data: company,
        message_en: 'company is created successfully',
    });
    company.save();
});
exports.addCompany = addCompany;
//@desc         get all companies owner
//@route        GET /api/v1/company
//@access       private(root,admin)
const getOwnerCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const ownerId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
    const companies = yield Company_1.Company.find({ owner: ownerId });
    res.send({
        success: true,
        data: companies,
        message_en: 'Companies are fetched successfully',
    });
});
exports.getOwnerCompanies = getOwnerCompanies;
//@desc         get a company by name
//@route        GET /api/v1/company/:id
//@access       private(root,admin)
const getCompanyByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const ownerId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
    const company = yield Company_1.Company.findOne({
        owner: ownerId,
        _id: req.params.id,
    });
    res.send({
        success: true,
        data: company,
        message_en: 'Company is fetched successfully',
    });
});
exports.getCompanyByName = getCompanyByName;
//@desc         update a company by name
//@route        PUT /api/v1/company/:id
//@access       private(root)
const updateCompanyByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { name } = req.body;
    const ownerId = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id;
    const chakeCompany = yield Company_1.Company.findOne({
        owner: ownerId,
    });
    console.log(name);
    if (!chakeCompany)
        return res
            .status(400)
            .send({ error_en: 'The company with the given NAME is not found' });
    //IV:must the name company be unique
    const nameCo = yield Company_1.Company.findOne({ name: name, _id: req.params.id });
    if (nameCo)
        return res
            .status(400)
            .send({ error_en: 'The company with the given NAME used befor' });
    yield Company_1.Company.updateOne({ owner: ownerId, _id: req.params.id }, {
        $set: {
            name: name,
        },
    });
    const newCompany = yield Company_1.Company.findOne({
        owner: ownerId,
        _id: req.params._id,
    });
    res.send({
        success: true,
        data: newCompany,
        message_en: 'Company is updated successfully',
    });
});
exports.updateCompanyByName = updateCompanyByName;
//@desc         delete a company by id
//@route        DELETE /api/v1/company/:id
//@access       private(root)
const deleteCompanyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chakeCompany = yield Company_1.Company.findOne({ _id: req.params.id });
    // if (chakeCompany?.clicked === 0) {
    //   await Company.updateOne({ clicked: 1 })
    //   return res.send({
    //     message_en:
    //       'If you want delete the company must know you will lose all your data in the company like the employees  , shifts , branches , departments',
    //     message_ar:
    //       'إذا كنت ترغب في حذف الشركة ، يجب أن تعلم أنك ستفقد جميع بياناتك في الشركة مثل الموظفين ، ورديات العمل ، والفروع ، والإدارات',
    //   })
    // }
    if (!chakeCompany)
        return res
            .status(400)
            .send({ error_en: 'The company with the given ID is not found' });
    const branches = (yield Branch_1.Branch.find({ company: req.params.id })).map((branch) => branch._id);
    yield User_1.default.deleteMany({ company: req.params.id });
    yield Company_1.Company.deleteOne({ _id: req.params.id });
    yield Department_1.Department.deleteMany({ branch: branches });
    yield Shift_1.Shift.deleteMany({ branch: branches });
    yield attendenc_model_1.Attendance.deleteMany({ branch: branches });
    yield Request_1.default.deleteMany({ branch: branches });
    yield payrol_1.default.deleteMany({ branch: branches });
    yield Contract_1.default.deleteMany({ branch: branches });
    yield Branch_1.Branch.deleteMany({ company: req.params.id });
    yield notification_model_1.Notification.deleteMany({ company: req.params.id });
    yield blog_model_1.default.deleteMany({ company: req.params.id });
    yield task_1.default.deleteMany({ company: req.params.id });
    yield subTask_1.default.deleteMany({ company: req.params.id });
    yield Category_1.default.deleteMany({ company: req.params.id });
    res.send({
        success: true,
        message_en: 'Company is deleted successfully',
    });
});
exports.deleteCompanyById = deleteCompanyById;
