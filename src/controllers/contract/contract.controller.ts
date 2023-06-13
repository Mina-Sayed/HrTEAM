import { Branch } from "../../models/branch";
import { Company } from "../../models/company";
import { AuthenticatedReq } from "../../middlewares/auth";
import { Response, NextFunction } from "express";
import Contract from "../../models/contract";
import { Roles } from "../../types/enums";
//@DESC : Get all Contracts
//@Route :GET  /teamHR/api/v1/contract/all/:company
//@access       private(root,admin)
export const getAllContract = async (req: AuthenticatedReq, res: Response) =>
{
    const companyId: string = req.query.company as string;
    if (!companyId) {
        return res.status(400).send({
            success: false,
            message: "Invalid request param !",
        });
    }

    try {
        const company: any = await Company.findOne({ _id: companyId });

        if (!company) {
            return res.status(400).send({ error_en: "Invalid company" });
        }

        const page: number = parseInt(req.query.page as string) || 1; // default to page 1 if not provided
        const limit: number = parseInt(req.query.limit as string) || 10; // default to limit 10 if not provided
        const skip = (page - 1) * limit;
        const options = {
            skip,
            limit,
        };
        let contracts: any;
        if (req.user?.role === Roles.EMPLOYEE) {
            contracts = await Contract.findOne({ employee: req.user._id })
                .populate("employee")
                .skip(skip)
                .limit(limit);
        } else {
            const AllBranches = (
                await Branch.find({ company: company._id.toString() })
            ).map((branch) => branch._id.toString());
            contracts = await Contract.find({ branch: AllBranches })
                .populate("employee")
                .skip(skip)
                .limit(limit);
        }

        if (!contracts.length) {
            return res
                .status(404)
                .send({
                    success: false,
                    message_en: "Contracts not found",
                });
        }
        return res.status(200).send({
            success: true,
            message_en: "Fetched contracts successfully",
            contracts: contracts,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while retrieving contracts",
        });
    }

};
//@DESC: Get Contract By Id
//@Route : GET /teamHR/api/v1/contract/:id
//@access       private(root,admin)
export const getContractById = async (req: AuthenticatedReq, res: Response) =>
{
    const id = req.params.id as string;
    const contract = await Contract.findById(id).populate(
        "employee",
        "fullName_en fullName_ar",
    );
    if (!contract) {
        res.status(404).send({
            success: false,
            message_en: "Contract Not Found",
        });
    }
    res.status(200).send({
        success: true,
        message_en: "Contract fetched successfully",
        contract: contract,
    });
};
//@DESC : ADD Contract
//@Route : POST /teamHR/api/v1/contract
//@access       private(root,admin)
export const addContract = async (req: AuthenticatedReq, res: Response) =>
{
    // check if contact already exist
    let {
        duration,
        salary,
        startDate,
        startStay,
        durationStay,
    } = req.body;
    // change the entered from string to Date
    if (typeof startDate === "string") {
        startDate = new Date(startDate);
    }
    const contractExist = await Contract.findOne({ employee: req.body.employee });
    if (contractExist) {
        return res
            .status(400)
            .send({
                success: false,
                message_en: "Contract already exist",
            });
    }
    // adding new employee
    const newContract = new Contract({
        ...req.body,
    });
    // changing the salary of the employee in the contractor
    newContract.dailySalary = newContract.getDailySalary(salary,
        duration);
    // calculating the endDate for the contract
    newContract.endDate = newContract.getEndDate(startDate,
        duration);
    newContract.endStay = newContract.getEndDate(startStay,
        durationStay);
    await newContract.save();
    res.status(200).send({
        success: true,
        message_en: "Contract added successfully",
        data: newContract,
    });
};
//@Desc : update Contract
//@Route : PUT /teamHR/api/v1/contract/:id
//@access       private(root,admin)
export const updateContract = async (req: AuthenticatedReq, res: Response) =>
{
    const {
        duration,
        salary,
        startDate,
        durationStay,
        startStay,
    } = req.body;
    const id = req.params.id;
    // check to see if the contract already exist or not
    const existedContract = await Contract.findById(id);
    if (!existedContract) {
        return res
            .status(400)
            .send({
                success: false,
                error_en: "Contract does not exist yet !",
            });
    }
    const updatedContract = await Contract.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true },
    ).populate("employee",
        "fullName_en fullName_ar");
    if (updatedContract != undefined) {
        // check if he changed the duration
        if (duration) {
            updatedContract.endDate = updatedContract.getEndDate(startDate,
                duration);
            updatedContract.dailySalary = updatedContract.getDailySalary(
                salary,
                startDate,
            );
        }
        if (durationStay) {
            updatedContract.endStay = updatedContract.getEndDate(
                startStay,
                durationStay,
            );
        }
        await updatedContract?.save();
        res.status(200).send({
            success: true,
            message_en: "Contract updated  successfully",
            contract: updatedContract,
        });
    }
};
//@Desc: Delete Contract
//@Route : Delete /teamHR/api/v1/contract/:id
//@access       private(root,admin)
export const deleteContract = async (req: AuthenticatedReq, res: Response) =>
{
    console.log("contractID : ===========================================");
    const id = req.params.id;
    const existedContract = await Contract.findById(id);
    if (!existedContract) {
        return res
            .status(400)
            .send({
                success: false,
                error_en: "Contract does not exist",
            });
    }
    await Contract.findByIdAndDelete(id);
    res
        .status(200)
        .send({
            success: true,
            message_en: "Contract deleted successfully",
        });
};
//@Desc: get filter Contract
//@Route : GET /teamHR/api/v1/contract/all/filter/
//@access       private(root,admin)
export const toggleGetContract = async (
    req: AuthenticatedReq,
    res: Response,
) =>
{
    const {
        department,
        branch,
    } = req.query;
    let contracts: any = [];

    if (req.user?.role === Roles.EMPLOYEE) {
        contracts = await Contract.find({ employee: req.user?._id }).populate([
            {
                path: "employee",
                model: "User",
            },
        ]);
    } else {
        const branches = (
            await Branch.find({ company: req.params.company })
        ).map((branch) => branch._id.toString());
        // get All Contract by branches when there is no query

        let filtrationOptions =
            Object.keys(req.query).length > 0
                ? { ...req.query }
                : {
                    branch: { $in: [ ...branches ] },
                };
        contracts = await Contract.find(filtrationOptions).populate([
            {
                path: "employee",
                model: "User",
            },
        ]);
    }

    if (contracts.length == 0) {
        return res
            .status(400)
            .send({
                success: false,
                message_en: "Contracts Not Found",
            });
    }
    res.status(200).send({
        success: true,
        message_en: "Contracts fetched successfully",
        contracts: contracts,
    });
};

export const getUserContract = async (req: AuthenticatedReq, res: Response) =>
{
    let option = req.params.userId ? req.params.userId : req?.user?._id;
    const contract = await Contract.findOne({ employee: option }).populate([
        {
            path: "employee",
            model: "User",
            populate: {
                path: "shift",
                model: "Shift",
                select: {
                    time: 1,
                    name: 1,
                },
            },
        },
        {
            path: "branch",
            model: "Branch",
            select: { name: 1 },
        },
        {
            path: "department",
            model: "Departments",
            select: { name: 1 },
        },
    ]);
    if (!contract) {
        return res
            .status(404)
            .send({
                error_en: "Can't Find Any Contract For You",
                error_ar: "ليس لديك عقد",
            });
    }
    res
        .status(200)
        .send({
            success_en: "Contract fetched successfully",
            success_ar: " تم جلب عقدك بنجاح",
            contract: contract,
        });
};
