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
exports.getOneYearOfUserPayrol = exports.getPayrollsbyDepartment = exports.getPayrolEmployee = exports.getPayrolById = exports.getAllPayRols = void 0;
const payrol_1 = __importDefault(require("../../models/payrol"));
const enums_1 = require("../../types/enums");
const moment_1 = __importDefault(require("moment"));
//DESC Get All The Payrol
//Route: GET /teamHR/api/v1/payrol
const getAllPayRols = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let payrols;
    if ((user === null || user === void 0 ? void 0 : user.role) === enums_1.Roles.EMPLOYEE) {
        payrols = yield payrol_1.default.find({
            employee: user._id,
            shift: user.shift,
        }).populate('shift employee');
    }
    else {
        payrols = yield payrol_1.default.find({ branch: req.params.branch }).populate('shift employee');
    }
    if (payrols.length <= 0)
        return res
            .status(400)
            .send({ success: false, success_en: `Can't Find Payrols` });
    res
        .status(200)
        .send({
        success: true,
        message_en: 'Payrols Fetched Successfully',
        payrols,
        count: payrols.length,
    });
});
exports.getAllPayRols = getAllPayRols;
//DESC : Get PayRol ById
//Route : Get /teamHR/api/v1/payrol/:id
const getPayrolById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payrolId = req.params.id;
    const payrol = yield payrol_1.default.findById(payrolId);
    if (!payrol)
        return res.status(400).send({ success: false, message: 'Payrol Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'Payrol Succesfully Fetched ' });
});
exports.getPayrolById = getPayrolById;
//DESC : Get PayRol ById
//Route : Get /teamHR/api/v1/payrol/:id
const getPayrolEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payrol = yield payrol_1.default.find({
        employee: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
    });
    if (!payrol)
        return res.status(400).send({ success: false, message: 'Payrol Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'Payrols Succesfully Fetched ', payrol });
});
exports.getPayrolEmployee = getPayrolEmployee;
//DESC : Get PayRol ById
//Route : Get /teamHR/api/v1/payrol/:id
const getPayrollsbyDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payrol = yield payrol_1.default.find({
        role: enums_1.Roles.EMPLOYEE,
        department: req.query.department
    }).populate([
        { path: 'employee', model: "User" }
    ]);
    if (!payrol)
        return res.status(400).send({ success: false, message: 'Payrol Not Found' });
    res
        .status(200)
        .send({ success: true, message_en: 'Payrols Succesfully Fetched ', payrol });
});
exports.getPayrollsbyDepartment = getPayrollsbyDepartment;
// // DESC : Get PayRol
// // Route: POST /TeamHR/api/v1/payrol/
// export const addPayrol=async(req:AuthenticatedReq,res:Response)=>{
//     const payrolExisted= await Payrol.findOne({employee:req.body.employee})
//     if(payrolExisted)
//         return res.status(500).send({success:false,message_en:'pay rol not found'})
//     const newPayrol=new Payrol({...req.body})
//     await newPayrol.save();
//     res.status(200).send({success:true,message:'new Payrol added'})
// }
// export const updatePayrol=async(req:AuthenticatedReq,res:Response)=>{
//     const id=req.params.id;
//     const payRolExisted=await Payrol.findByIdAndUpdate(id,{...req.body},{new:true})
//     if(!payRolExisted){
//         return res.status(400).send({success:true,message:'updated payrol successfully'})
//     }
// }
// i want to create A function to get the yearly payrol for the user 
// THE LOGIC WOULD BE CREATE OBJECT EACH KEY IS THE MONTH THEN USING THAT 
// CREATE THE LOGIC OF ANAGRAM TO GET THE FREQUENT COUNT OF THE USER DATA BASED ON THE MONTH 
const getOneYearOfUserPayrol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //1)create object of the monthes 
    const getTheMonth = (payrol) => {
        return (0, moment_1.default)(new Date(payrol === null || payrol === void 0 ? void 0 : payrol.createdAt).setMonth(new Date(payrol === null || payrol === void 0 ? void 0 : payrol.createdAt).getMonth())).format('MMMM');
    };
    // 1 need to get all the payrols for the user
    const payrols = yield payrol_1.default.find({ employee: req.params.userId });
    // getting an object of all the years of each payrol for the user
    let years = {};
    let monthes = [];
    payrols.forEach((payrol, index) => {
        let tempYear = (new Date(payrol === null || payrol === void 0 ? void 0 : payrol.createdAt).getFullYear());
        if (!years[tempYear]) {
            years[tempYear] = [];
        }
        // now we have this year lets to ity
        years[tempYear].push(payrol);
        for (let i = 0; i < 12; i++) {
            monthes.push([]);
        }
        //THIS IS LOGIC TO GET IT WITH MONTHES NOT BY YEARS
        // let tempMonth = getTheMonth(payrol)
        // let monthIndex = new Date(payrol?.createdAt).getMonth()
        // monthes[monthIndex].push(payrol)
        // console.log(` at tempMOnth of ${tempMonth} monthes[${monthIndex}]=${monthes[monthIndex]}`)
        // years[tempYear][tempMonth] = monthes[monthIndex]
    });
    if (!Object.keys(years)[0]) {
        return res.status(400).send({ error_en: "Payrols Are Not Found ", error_ar: 'لم يتم العثور على رواتب' });
    }
    res.status(200).send({ success_en: "Payrols are fetched successfully", success_ar: 'تم جلب الرواتب بنجاح', years, payrols });
});
exports.getOneYearOfUserPayrol = getOneYearOfUserPayrol;
