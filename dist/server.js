"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const autoSend_helper_1 = require("./helpers/autoSend.helper");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const http = __importStar(require("http"));
const node_cron_1 = __importDefault(require("node-cron"));
// const options:any = {
//   key: fs.readFileSync(path.join(__dirname, `../../etc/letsencrypt/live/sarei3.com/privkey.pem`)),
//   cert: fs.readFileSync(path.join(__dirname, `../../etc/letsencrypt/live/sarei3.com/fullchain.pem`))
// };
const server = http.createServer(app_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        node_cron_1.default.schedule(`* * * */1 * *`, () => __awaiter(void 0, void 0, void 0, function* () {
            (0, autoSend_helper_1.autoNotification)();
        }));
        const date = new Date(Date.now());
        yield mongoose_1.default.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        server.listen(process.env.PORT || 5000);
        console.log('Connected to database successfully');
        console.log('Server is running on port ' + process.env.PORT);
    }
    catch (err) {
        console.log('Error on DB Connecting: ' + err.message);
        process.on('unhandelRejection', (err, promise) => {
            console.log(`Error : ${err.message}`);
            //close server & exit process
            server.close(() => process.exit(1));
        });
    }
}))();
exports.default = server;
