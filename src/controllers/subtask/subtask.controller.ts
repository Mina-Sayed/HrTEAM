import {Router, Response, NextFunction} from 'express';
import {AuthenticatedReq} from '../../middlewares/auth';
import Subtask from '../../models/subtask';
//@DESc : Get All The subTasks
//@Route : GET /teamHR/api/v1/subtask
export const getAllSubTasks = async (req: AuthenticatedReq, res: Response) =>
{
    const subtasks = await Subtask.find({taks: req.params.task}).populate("recivedUser");
    if (subtasks.length <= 0)
        return res
            .status(400)
            .send({success: false, message: 'SubTasks Are Not Found'});
    res
        .status(200)
        .send({success: true, message: 'SubTasks fetched Succesfully', subtasks});
};

//@DESC : get SubTaskById
//@Route: GET /teamHR/api/v1/subtask/:id
export const getSubTaskById = async (req: AuthenticatedReq, res: Response) =>
{
    const subTaskId = req.params.id;
    const subTask = await Subtask.findById(subTaskId).populate('task', '');
    if (!subTask)
        return res
            .status(400)
            .send({success: false, message_en: 'subTask Not Found'});
    return res
        .status(200)
        .send({success: 'subtask fetched Successfully', subTask});
};

//@DESC: add SubTAskById
//@Route : POST /teamHR/api/v1/subtask/
export const addSubTask = async (req: AuthenticatedReq, res: Response) =>
{
    const subtask = new Subtask({
        ...req.body,
    });
    await subtask.save();
    res
        .status(200)
        .send({success: true, message_en: 'subTask Added Successfully', subtask});
};

//@DESC : update subtask
//@Route : PUT /teamHR/api/v1/subtask/:id

export const updateSubTask = async (req: AuthenticatedReq, res: Response) =>
{
    const subTaskId = req.params.id;
    const subTask = await Subtask.findByIdAndUpdate(
        subTaskId,
        {...req.body},
        {new: true},
    );
    if (!subTask)
        return res
            .status(400)
            .send({success: false, message: 'subTask not Found'});
    res
        .status(200)
        .send({success: true, message: 'Subtask Updated Successfully', subTask});
};
//@DESC : Update
export const deleteSubTask = async (req: AuthenticatedReq, res: Response) =>
{
    const subTaskId = req.params.id;
    const subTask = await Subtask.findByIdAndDelete(subTaskId);
    if (!subTask)
        return res
            .status(400)
            .send({success: false, message_en: 'Subtask Not Found'});
    res
        .status(200)
        .send({success: true, message_en: 'subTask Deleted Successfully'});
};
