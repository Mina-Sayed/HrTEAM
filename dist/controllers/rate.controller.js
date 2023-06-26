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
exports.qurterRate = exports.getRateMonth = exports.rateSincecontract = void 0;
const mongodb_1 = require("mongodb");
const getRateData_helper_1 = require("../helpers/getRateData.helper");
const Contract_1 = __importDefault(require("../models/Contract"));
//@desc         get total rate since contract
//@route        GET /api/v1/rate/:userId
//@access       private(admin)
const rateSincecontract = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = new mongodb_1.ObjectId(req.params.userId);
    const contract = yield Contract_1.default.findOne({ member: userId });
    const rateData = yield (0, getRateData_helper_1.getRateData)(contract.startDate, new Date(Date.now()), userId);
    res.send(rateData);
});
exports.rateSincecontract = rateSincecontract;
//@desc         get month rate
//@route        GET /api/v1/rate/month/:userId
//@access       private(admin)
const getRateMonth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { month, year } = req.query;
    if (isNaN(month) || isNaN(year))
        return res.status(400).send('month and year are required');
    if (month < 1 || month > 12)
        return res.status(400).send('invalid month');
    if (year < 1)
        return res.status(400).send('invalid year');
    const userId = new mongodb_1.ObjectId(req.params.userId);
    const fromDate = new Date(year, month - 1, 2);
    const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1);
    const rateData = yield (0, getRateData_helper_1.getRateData)(fromDate, toDate, userId);
    res.send(rateData);
});
exports.getRateMonth = getRateMonth;
//@desc         get quarter rate
//@route        GET /api/v1/rate/quarter/:userId
//@access       private(admin)
const qurterRate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { quarter, year } = req.query;
    const userId = req.params.userId;
    if (isNaN(quarter) || isNaN(year))
        return res.status(400).send('quarter and year are required');
    if (quarter < 1 || quarter > 4)
        return res.status(400).send('quarter is (1~4)');
    if (year < 1)
        return res.status(400).send('invalid year');
    quarter = Math.floor(quarter);
    let startDate = new Date(year, (quarter - 1) * 3);
    let endDate = new Date(year, quarter * 3);
    const rateData = yield (0, getRateData_helper_1.getRateData)(startDate, endDate, userId);
    res.send(rateData);
});
exports.qurterRate = qurterRate;
