import colors from "colors";
import fs from "fs";
import User from "../models/user";
import Package from "../models/package";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { Company } from "../models/company";


dotenv.config({ path: path.resolve(__dirname, `../config/development.env`) });

const Users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
const Packages = JSON.parse(fs.readFileSync("./packages.json", "utf-8"));
const Companies = JSON.parse(fs.readFileSync("./companies.json", "utf-8"));

//  Pushing data to db
const pushJsonData = async (data: any, collection: mongoose.Model<any>) =>
{
    await collection.create(data);
};


//Delete all data
const deleteAllModelData = async (collection: mongoose.Model<any>) =>
{
    await collection.deleteMany({});
};

const addAllData = async () =>
{
    try {
        await pushJsonData(Companies, Company);
        await pushJsonData(Users, User);
        await pushJsonData(Packages, Package);
        console.log(colors.bgBlue.white.bold("all data is added"));
    } catch (err) {
        console.log(`Error while seeding data ${ err }`);
        process.exit(1);
    }

};

const removeAllData = async () =>
{
    try {
        await deleteAllModelData(User);
        await deleteAllModelData(Package);
        await deleteAllModelData(Company);
        console.log(colors.bgRed.white.bold("all data is deleted"));
    } catch (err) {
        console.log(colors.bgRed.white.bold(`Error while deleting data ${ err }`));
        process.exit(1);
    }
};

(async () =>
{
    const operation = process.argv[2];
    try {
        if (operation === "i") {
            await mongoose.connect(process.env.MONGO_URI!);
            await addAllData();
        }
        if (operation === "d") {
            await mongoose.connect(process.env.MONGO_URI!);
            await removeAllData();
        }
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
})();