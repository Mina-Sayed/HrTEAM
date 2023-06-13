import { Model } from "mongoose";


export async function findById(Model: Model<any>, id: any)
{
    const find = await Model.findById(id);
    if (!find) {
        return false;
    } else {
        return true;
    }

}