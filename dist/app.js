"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const joi_1 = __importDefault(require("joi"));
const user_router_1 = __importDefault(require("./routes/v1/user.router"));
const package_router_1 = __importDefault(require("./routes/v1/package.router"));
const subscription_router_1 = __importDefault(require("./routes/v1/subscription.router"));
const auth_router_1 = __importDefault(require("./routes/v1/auth.router"));
const branch_router_1 = __importDefault(require("./routes/v1/branch.router"));
const department_router_1 = __importDefault(require("./routes/v1/department.router"));
const shift_router_1 = __importDefault(require("./routes/v1/shift.router"));
const request_router_1 = __importDefault(require("./routes/v1/request.router"));
const category_router_1 = __importDefault(require("./routes/v1/category.router"));
const subCategory_router_1 = __importDefault(require("./routes/v1/subCategory.router"));
const contract_router_1 = __importDefault(require("./routes/v1/contract.router"));
const payrol_router_1 = __importDefault(require("./routes/v1/payrol.router"));
const task_router_1 = __importDefault(require("./routes/v1/task.router"));
const subtask_router_1 = __importDefault(require("./routes/v1/subtask.router"));
joi_1.default.object = require('joi-objectid')(joi_1.default);
const company_router_1 = __importDefault(require("./routes/v1/company.router"));
const overtime_router_1 = __importDefault(require("./routes/v1/overtime.router"));
const break_router_1 = __importDefault(require("./routes/v1/break.router"));
const attende_router_1 = __importDefault(require("./routes/v1/attende.router"));
const blog_routes_1 = __importDefault(require("./routes/v1/blog.routes"));
const comment_routes_1 = __importDefault(require("./routes/v1/comment.routes"));
const rate_routes_1 = __importDefault(require("./routes/v1/rate.routes"));
const notifiction_routes_1 = __importDefault(require("./routes/v1/notifiction.routes"));
const document_router_1 = __importDefault(require("./routes/v1/document.router"));
const uploads_1 = require("./middlewares/uploads");
const error_1 = require("./errors/error");
const post_router_1 = __importDefault(require("./routes/v1/post.router"));
const services_router_1 = __importDefault(require("./routes/v1/services.router"));
const faq_router_1 = __importDefault(require("./routes/v1/faq.router"));
const contactus_router_1 = __importDefault(require("./routes/v1/contactus.router"));
// import ip from 'ip'
// const API_KEY = 'c0d773f89b0b8d96b8ec209db1b72153a8c5aefcf33813684dd561dd'
// const URL = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + API_KEY
// import axios from 'axios'
// const sendAPIRequest = async (ipAddress: any) => {
//   const apiResponse = await axios.get(URL + '&ip_address=' + ipAddress)
//   return apiResponse.data
// }
// import attend from './routes/v1/'
const app = (0, express_1.default)();
process.env.NODE_ENV !== 'production' && app.use((0, morgan_1.default)('dev'));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname + `/config/${process.env.NODE_ENV}.env`),
});
app
    .use((0, cors_1.default)())
    .use(body_parser_1.default.json())
    .use(body_parser_1.default.urlencoded({ extended: true }));
// Routes
// app.get('/', async (req, res) => {
//   const ipAddress = ip.address()
//   const info = await sendAPIRequest('192.168.1.1')
//   console.log(info)
//   res.send(info)
// })
app.use(error_1.errorHandler)
    .use(express_1.default.json())
    // .use(errorHandler)
    .use('/teamHR/api/v1/auth/', auth_router_1.default)
    .use('/teamHR/api/v1/user/', user_router_1.default)
    .use('/teamHR/api/v1/package/', package_router_1.default)
    .use('/teamHR/api/v1/subscription/', subscription_router_1.default)
    .use('/teamHR/api/v1/company/', company_router_1.default)
    .use('/teamHR/api/v1/branch/', branch_router_1.default)
    .use('/teamHR/api/v1/department/', department_router_1.default)
    .use('/teamHR/api/v1/shift/', shift_router_1.default)
    .use('/teamHR/api/v1/category', category_router_1.default)
    .use('/teamHR/api/v1/subCategory', subCategory_router_1.default)
    .use('/teamHR/api/v1/request', request_router_1.default)
    .use('/teamHR/api/v1/contract', contract_router_1.default)
    .use('/teamHR/api/v1/payrol', payrol_router_1.default)
    .use('/teamHR/api/v1/task', task_router_1.default)
    .use('/teamHR/api/v1/subtask', subtask_router_1.default)
    .use('/teamHR/api/v1/break', break_router_1.default)
    .use('/teamHR/api/v1/over', overtime_router_1.default)
    .use('/teamHR/api/v1/attendance', attende_router_1.default)
    .use('/teamHR/api/v1/blog', blog_routes_1.default)
    .use('/teamHR/api/v1/comment', comment_routes_1.default)
    .use('/teamHR/api/v1/rate', rate_routes_1.default)
    .use('/teamHR/api/v1/notifiction', notifiction_routes_1.default)
    .use('/teamHR/api/v1/document', document_router_1.default)
    .use("/teamHR/api/v1/post", post_router_1.default)
    .use("/teamHR/api/v1/services", services_router_1.default)
    .use("/teamHR/api/v1/faq", faq_router_1.default)
    .use('/teamHR/api/v1/contactUs', contactus_router_1.default)
    .use('/uploads', express_1.default.static('./uploads'))
    .post('/teamHR/api/v1/upload', uploads_1.upload.single('image'), (req, res) => {
    var _a;
    res.status(200).send({ filename: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename });
})
    .all('*', (req, res) => res.status(404).send({ message: 'Undefinded Routes' }));
exports.default = app;
