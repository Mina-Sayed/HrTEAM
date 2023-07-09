import { Model } from "mongoose";
export async function FindeById(Model: Model<any>, id: any) {
    const find = await Model.findById(id)
    if (!find) return false;
    return true
}