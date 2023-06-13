import { ObjectId } from "mongodb";
import { Roles } from "../../types/enums";
import { Company } from "../../models/company";
import { Department } from "../../models/department";
import { Branch } from "../../models/branch";
import { AuthenticatedReq } from "../../middlewares/auth";
import { Response } from "express";
import Request from "../../models/request";
import SubCategory from "../../models/subCategory";
import User from "../../models/user";

//@Desc:    Create Request
//@router:  POST teamHR/api/v1/request
export const addRequest = async (req: AuthenticatedReq, res: Response) =>
{
    const {
        title,
        description,
        from,
        to,
        startDate,
        endDate,
        ids,
    } = req.body;
    console.log(title);

    // Must check the sub-category if it exists or not.
    const checkTitle = ObjectId.isValid(title);
    let subCategory: any = !checkTitle
        ? {
            haveTime: false,
            subType: title,
        }
        : await SubCategory.findById(title);
    console.log(subCategory, "subCategory");

    if (!subCategory && checkTitle) {
        return res.status(400).send({
            error_en: "Invalid Sub Category",
            error_ar: "فئة فرعية غير صالحة",
        });
    }
    console.log(startDate);

    //II: check if user have time or not
    if (
        (!startDate || !endDate) &&
        subCategory.haveTime &&
        req.user?.role === Roles.EMPLOYEE
    ) {
        return res
            .status(400)
            .send({ error_en: "The time start and end for request is required " });
    }
    // check who sent the request to take action about this.
    const user: any = await User.findOne({ _id: req.user?._id });
    const requests = [];

    if (user.role === "employee") {
        const getRequest = await Request.findOne({
            title: title,
            from: user._id,
            status: false,
            type: "request",
        });
        const data = {
            title: subCategory.subType,
            from: user._id,
            description: description,
            company: user.company,
            branch: user.branch,
            department: user.department,
            startDate: startDate,
            endDate: endDate,
            type: "request",
            status: false,
        };
        !getRequest && requests.push(data);
        // const request = await Request.insertMany(requests)
        // const newRequest  =  Request.cre()
    }
    if (user.role === "admin" || user.role === "root") {
        const company = await Company.findOne({ _id: to });
        const branch = await Branch.findOne({ _id: to });
        const department = await Department.findOne({ _id: to });
        const user = await User.find({ _id: ids });
        if (!to && !ids) {
            return res.status(400).send({ error_en: "Employees are required" });
        }
        // for send the request an employee
        if (user[0]) {
            const employees = (
                await User.find({
                    _id: ids,
                })
            ).map((employee) => employee);
            for (let index = 0; index < employees.length; index++) {
                const employee = employees[index];
                const getRequest = await Request.findOne({
                    title: title,
                    to: employee._id,
                    from: req.user?._id,
                    type: req.user?.role === Roles.ROOT ? "alert" : "request",
                });
                const data = {
                    title: subCategory.subType,
                    to: employee._id,
                    from: req.user?._id,
                    company: employee.company,
                    branch: employee.branch,
                    department: employee.department,
                    description: description,
                    startDate: startDate,
                    endDate: endDate,
                    type: req.user?.role === Roles.ROOT ? "alert" : "request",
                };
                !getRequest && requests.push(data);
            }
        }
        if (to) {
            // for send the request to all employees in branch
            if (branch) {
                const employees = (
                    await User.find({
                        branch: branch._id,
                    })
                ).map((employee) => employee);
                for (let index = 0; index < employees.length; index++) {
                    const employee = employees[index];
                    const getRequest = await Request.findOne({
                        title,
                        to: employee._id,
                        from: req.user?._id,
                        status: false,
                    });
                    const data = {
                        title: subCategory.subType,
                        to: employee._id,
                        company: employee.company,
                        branch: employee.branch,
                        department: employee.department,
                        from: req.user?._id,
                        description: description,
                        startDate: subCategory.haveTime || title ? startDate : undefined,
                        endDate: subCategory.haveTime || title ? endDate : undefined,
                        type: req.user?.role === Roles.ROOT ? "alert" : "request",
                    };
                    !getRequest && requests.push(data);
                }
            }
            // for send the request to all employees in department
            if (department) {
                const employees = (
                    await User.find({
                        department: department._id,
                    })
                ).map((employee) => employee);
                for (let index = 0; index < employees.length; index++) {
                    const employee = employees[index];
                    const getRequest = await Request.findOne({
                        title,
                        to: employee._id,
                        from: req.user?._id,
                        status: false,
                    });
                    const data = {
                        title: subCategory.subType,
                        to: employee._id,
                        company: employee.company,
                        branch: employee.branch,
                        department: employee.department,
                        from: req.user?._id,
                        description: description,
                        startDate: subCategory.haveTime || title ? startDate : undefined,
                        endDate: subCategory.haveTime || title ? endDate : undefined,
                        type: req.user?.role === Roles.ROOT ? "alert" : "request",
                    };
                    !getRequest && requests.push(data);
                }
            }
            // for send the request to all employees in company
            if (company) {
                const employees = (
                    await User.find({
                        company: company._id,
                    })
                ).map((employee) => employee);
                for (let index = 0; index < employees.length; index++) {
                    const employee = employees[index];
                    const getRequest = await Request.findOne({
                        title,
                        to: employee._id,
                        from: req.user?._id,
                        status: false,
                    });
                    const data = {
                        title: subCategory.subType,
                        to: employee._id,
                        from: req.user?._id,
                        company: employee.company,
                        branch: employee.branch,
                        department: employee.department,
                        description: description,
                        startDate: subCategory.haveTime || title ? startDate : undefined,
                        endDate: subCategory.haveTime || title ? endDate : undefined,
                        type: req.user?.role === Roles.ROOT ? "alert" : "request",
                    };
                    !getRequest && requests.push(data);
                }
            }
            // if the ID IS Wrong
            if (!user && !company && !department && !branch) {
                return res
                    .status(400)
                    .send({ error_en: "can't get any thing with the given ID" });
            }
        }
    }
    const request = await Request.insertMany(requests);
    if (!request[0]) {
        return res.status(400).send({
            error_en: "You already send the request before",
            error_ar: "لقد ارسلت الطلب من قبل ",
        });
    }
    res.status(200).send({
        data: request,
        message_en: "Request is created succesfuly ",
    });
};

//@Desc: get All The Requests
//@route: get api/v1/request
export const getAllRequests = async (req: AuthenticatedReq, res: Response) =>
{
    let requests: any;
    const {
        company,
        branch,
        department,
    }: any = req.query;

    if (req.user?.role === Roles.EMPLOYEE) {
        requests = await Request.find({
            type: "request",
            branch: req.user.branch.toString(),
            company: req.user.company.toString(),
            department: req.user.department.toString(),
            $or: [
                {
                    to: req.user._id,
                },
                {
                    from: req.user._id,
                },
            ],
        }).populate("from to");
    }
    if (req.user?.role === "admin" || req.user?.role === "root") {
        if (!company && !department && !branch) {
            return res.status(400).send({
                error_en:
                    "please select company or branch or department to get requests and alerts",
            });
        }
        const adminsAndOwners = (
            await User.find({
                company: req.user?.company
                    ? req.user?.company.toString()
                    : req.query.company,
                role: [ "admin", "root" ],
            })
        ).map((admin) => admin._id);
        requests = await Request.find({
            type: "request",
            $or: [
                {
                    company: company,
                },
                {
                    branch: branch,
                },
                {
                    department: department,
                },
                {
                    from: adminsAndOwners,
                },
                {
                    to: adminsAndOwners,
                },
            ],
        }).populate("from to");
    }
    if (!requests[0]) {
        return res.status(400).send({ error_en: "No Request has been made yet" });
    }
    res.status(200).send({
        message: "Requests fetched successfully",
        requests: requests,
    });
};
export const getAllAlerts = async (req: AuthenticatedReq, res: Response) =>
{
    let alerts: any;
    const {
        company,
        branch,
        department,
    }: any = req.query;

    if (req.user?.role === Roles.EMPLOYEE) {
        alerts = await Request.find({
            type: "alert",
            $or: [
                {
                    to: req.user._id,
                },
            ],
        }).populate("from to");
    }
    if (req.user?.role === "admin" || req.user?.role === "root") {
        if (!company && !department && !branch) {
            return res.status(400).send({
                error_en:
                    "please select company or branch or department to get requests and alerts",
            });
        }
        const adminsAndOwners = (
            await User.find({
                company: req.user?.company
                    ? req.user?.company.toString()
                    : req.query.company,
                role: [ "admin", "root" ],
            })
        ).map((admin) => admin._id);
        alerts = await Request.find({
            type: "alert",
            $or: [
                {
                    company: company,
                },
                {
                    branch: branch,
                },
                {
                    department: department,
                },
            ],
        }).populate("from to");
    }
    if (!alerts[0]) {
        return res.status(400).send({ error_en: "No Alerts has been made yet" });
    }
    res.status(200).send({
        message: "Alerts fetched successfully",
        alerts: alerts,
    });
};
//@Desc: get All The Requests Receive
//@route: get api/v1/request/receive
export const getAllReceived = async (req: AuthenticatedReq, res: Response) =>
{
    let requests: any;
    const {
        company,
        branch,
        department,
    } = req.query;
    if (req.user?.role === "employee") {
        requests = await Request.find({
            to: req.user._id,
            type: "request",
        }).populate("from to");
        console.log(requests);
    }
    if (req.user?.role === "admin" || req.user?.role === "root") {
        if (!company && !department && !branch) {
            return res.status(400).send({
                error_en:
                    "please select company, branch or department to get requests and alerts",
            });
        }

        requests = await Request.find({
            $or: [
                {
                    company: company,
                    to: undefined,
                },
                {
                    branch: branch,
                },
                {
                    department: department,
                },
            ],
            type: "request",
        }).populate("from to");
    }

    if (!requests[0]) {
        return res.status(400).send({ error_en: "No Request has been made yet" });
    }
    res.status(200).send({
        message: "Requests fetched successfully",
        requests: requests,
    });
};
//@Desc: get All The Requests sent
//@route: get api/v1/request/send
export const getAllSend = async (req: AuthenticatedReq, res: Response) =>
{
    let requests: any = [];
    const {
        company,
        branch,
        department,
    } = req.query;
    if (req.user?.role === "employee") {
        requests = await Request.find({
            from: req.user._id,
            $or: [
                {
                    company: company,
                },
                {
                    branch: branch,
                },
                {
                    department: department,
                },
            ],
            type: "request",
        }).populate("from to");
    }
    if (req.user?.role === "admin") {
        if (!company && !department && !branch) {
            return res.status(400).send({
                error_en:
                    "please select company or branch or department to get requests and alerts",
            });
        }
        const adminsAndOwners: any = (
            await User.find({
                company: company,
                role: [ "admin", "root" ],
            })
        ).map((admin) => admin._id.toString());
        console.log(adminsAndOwners);

        requests = await Request.find({
            from: adminsAndOwners,
            $or: [
                {
                    company: company,
                },
                {
                    branch: branch,
                },
                {
                    department: department,
                },
            ],
            type: "request",
        }).populate("from to");
    }

    if (!requests.length) {
        return res.status(404).send({ error_en: "No Request has been made yet" });
    }
    res.status(200).send({
        message: "Request fetched successfully",
        requests: requests,
    });
};
//@Desc:    Get Request By Id
//@Route:   GET api/v1/request/:id

export const getRequestById = async (req: AuthenticatedReq, res: Response) =>
{
    const id = req.params.id;
    // check if the request exist or not
    const request = await Request.findById(id).populate(
        "from to",
        "fullName_ar fullName_en image",
    );
    if (!request) {
        return res.status(404).send({ error_en: "Request Not Found" });
    }
    res.status(200).send({
        message: "Request fetched successfully",
        data: request,
    });
};

//@Desc update Request
//@Route : put api/v1/request/:id

export const updateRequest = async (req: AuthenticatedReq, res: Response) =>
{
    const id = req.params.id;
    console.log(req.body);

    // check if the request exist or not
    const isRequestExist = await Request.findById(id);
    if (!isRequestExist) {
        return res
            .status(404)
            .send({ error_en: "The Request has not been made Yet" });
    }
    const updatedRequest = await Request.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true },
    );
    res.status(200).send({
        success: true,
        message_en: "Request updated successfully",
        data: updatedRequest,
    });
};

//@Desc Delete Request
//@Route : Delete api/v1/request/:id

export const deleteRequest = async (req: AuthenticatedReq, res: Response) =>
{
    const id = req.params.id;
    // check if the request exist or not
    console.log("requestId; ", id);
    const isRequestExist = await Request.findById(id);
    console.log("request: ", isRequestExist);

    if (!isRequestExist) {
        return res.status(400).send({ error_en: "Request Not Found" });
    }
    console.log("====================", req?.user?._id, isRequestExist?.from);
    if (isRequestExist && req?.user?.role == "employee" && req?.user?._id.toString() != isRequestExist?.from.toString()) {
        return res.status(409).send({
            error_en: "Cannot delete the request",
            error_ar: "Cannot delete the request",
        });
    }
    const deletedRequest = await Request.findByIdAndDelete(id);
    console.log(deletedRequest);
    res
        .status(200)
        .send({
            success: true,
            message: "Request is deleted successfully",
        });
};
