import app from '../../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import User from '../../../models/user';
import childProcess from 'child_process';

let mongoServer: MongoMemoryServer;
const loginEndpoint = '/api/v1/auth/login';
beforeAll(async () =>
{
    // Connecting to database
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    process.env.process_ENV = "test";
    process.env.MONGO_URI = mongoUri;
});

describe('auth superadmin', async () =>
{
    beforeAll(() =>
    {
        childProcess.fork('../../../data/seeder', {execArgv: ["i"]});
    });

    it('login as superadmin', async () =>
    {
        const res = await request(app)
            .post(loginEndpoint)
            .send({
                email: "ahmed@superadmin.com",
                password: "123123123"
            });

        expect(res.statusCode).toBe(200);
    });

    afterAll(async () =>
    {
        childProcess.fork('../../../data/seeder', {execArgv: ["d"]});
    });
});

afterAll(async () =>
{
    await mongoose.disconnect();
    await mongoServer.stop();
});

