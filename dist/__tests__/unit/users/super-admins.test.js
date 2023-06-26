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
const app_1 = __importDefault(require("../../../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const child_process_1 = __importDefault(require("child_process"));
let mongoServer;
const loginEndpoint = '/api/v1/auth/login';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Connecting to database
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    yield mongoose_1.default.connect(mongoUri);
    process.env.process_ENV = "test";
    process.env.MONGO_URI = mongoUri;
}));
describe('auth superadmin', () => __awaiter(void 0, void 0, void 0, function* () {
    beforeAll(() => {
        child_process_1.default.fork('../../../data/seeder', { execArgv: ["i"] });
    });
    it('login as superadmin', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(loginEndpoint)
            .send({
            email: "ahmed@superadmin.com",
            password: "123123123"
        });
        expect(res.statusCode).toBe(200);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        child_process_1.default.fork('../../../data/seeder', { execArgv: ["d"] });
    }));
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
}));
