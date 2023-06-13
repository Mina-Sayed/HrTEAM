import { NextFunction } from "express";
import { AuthenticatedReq } from "../../middlewares/auth";
import { Router, Response } from "express";
import Payroll from "../../models/payroll";
import { Roles } from "../../types/enums";
import moment from "moment";
//DESC Get All The Payroll
//Route: GET /teamHR/api/v1/payroll
export const getAllPayRolls = async (req: AuthenticatedReq, res: Response) => {
    const user = req.user;
    const page = parseInt(req.query.page as string) || 1; // default to page 1 if not specified
    const pageSize = parseInt(req.query.pageSize as string) || 10; // default to 10 documents per page if not specified

    let query;
    if (user?.role === Roles.EMPLOYEE) {
        query = Payroll.find({
            employee: user._id,
            shift: user.shift,
        });
    } else {
        query = Payroll.find({ branch: req.params.branch });
    }

    const count = await query.countDocuments();
    const pageCount = Math.ceil(count / pageSize);
    if (page > pageCount) {
        return res.status(400).send({
            success: false,
            success_en: `Page number exceeds the total number of pages`,
        });
    }

    const payrolls = await query
        .populate("shift employee")
        .skip((page - 1) * pageSize)
        .limit(pageSize);

    if (payrolls.length <= 0) {
        return res.status(400).send({
            success: false,
            success_en: `Can't Find Payrolls`,
        });
    }

    res.status(200).send({
        success: true,
        message_en: "Payrolls Fetched Successfully",
        payrolls: payrolls,
        count: count,
        pageCount: pageCount,
        currentPage: page,
    });
};


//DESC : Get PayRol ById
//Route : Get /teamHR/api/v1/payroll/:id
export const getPayrollById = async (req: AuthenticatedReq, res: Response) =>
{
    const payrollId = req.params.id;
    const payroll = await Payroll.findById(payrollId);
    if (!payroll) {
        return res.status(400).send({
            success: false,
            message: "Payroll Not Found",
        });
    }
    res
        .status(200)
        .send({
            success: true,
            message_en: "Payroll successfully fetched ",
        });
};
//DESC : Get PayRol ById
//Route : Get /teamHR/api/v1/payroll/:id
export const getPayrollEmployee = async (
    req: AuthenticatedReq,
    res: Response,
) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const payroll = await Payroll.find({ employee: req.user?._id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const count = await Payroll.countDocuments({ employee: req.user?._id });

    if (payroll.length === 0) {
        return res.status(400).send({
            success: false,
            message: "Payroll not found",
        });
    }

    const pageCount = Math.ceil(count / limit);

    res.status(200).send({
        success: true,
        message_en: "Payrolls successfully fetched",
        totalPayrolls: count,
        currentPage: page,
        totalPages: pageCount,
        payroll: payroll,
    });
};

//DESC : Get PayRol ById
//Route : Get /teamHR/api/v1/payroll/:id
export const getPayrollByDepartment = async (
    req: AuthenticatedReq,
    res: Response,
    next: NextFunction,
) =>
{
    const payroll = await Payroll.find({
        role: Roles.EMPLOYEE,
        department: req.query.department,
    }).populate([
        {
            path: "employee",
            model: "User",
        },
    ]);
    if (!payroll) {
        return res.status(400).send({
            success: false,
            message: "Payroll Not Found",
        });
    }
    res
        .status(200)
        .send({
            success: true,
            message_en: "Payrolls successfully Fetched ",
            payroll: payroll,
        });
};
// // DESC : Get PayRol
// // Route: POST /TeamHR/api/v1/payroll/
// export const addPayrol=async(req:AuthenticatedReq,res:Response)=>{
//     const payrolExisted= await Payroll.findOne({employee:req.body.employee})
//     if(payrolExisted)
//         return res.status(500).send({success:false,message_en:'pay rol not found'})
//     const newPayrol=new Payroll({...req.body})
//     await newPayrol.save();
//     res.status(200).send({success:true,message:'new Payroll added'})

// }

// export const updatePayrol=async(req:AuthenticatedReq,res:Response)=>{
//     const id=req.params.id;

//     const payRolExisted=await Payroll.findByIdAndUpdate(id,{...req.body},{new:true})
//     if(!payRolExisted){
//         return res.status(400).send({success:true,message:'updated payroll successfully'})
//     }

// }


// i want to create A function to get the yearly payroll for the user
// THE LOGIC WOULD BE CREATE OBJECT EACH KEY IS THE MONTH THEN USING THAT 
// CREATE THE LOGIC OF ANAGRAM TO GET THE FREQUENT COUNT OF THE USER DATA BASED ON THE MONTH 

export const getOneYearOfUserPayroll = async (req: AuthenticatedReq, res: Response) =>
{
    //1)create object of the monthes
    const getTheMonth = (payroll: any) =>
    {


        return moment(new Date(payroll?.createdAt).setMonth(new Date(payroll?.createdAt).getMonth())).format("MMMM");

    };


    // 1 need to get all the payrols for the user
    const payrolls: any = await Payroll.find({ employee: req.params.userId });

    // getting an object of all the years of each payroll for the user
    let years: any = {};
    let monthes: any[] = [];
    payrolls.forEach((payroll: any, index: any) =>
    {
        let tempYear = (new Date(payroll?.createdAt).getFullYear());

        if (!years[tempYear]) {
            years[tempYear] = [];
        }
        // now we have this year lets to ity
        years[tempYear].push(payroll);


        for (let i = 0; i < 12; i++) {
            monthes.push([]);

        }


        //THIS IS LOGIC TO GET IT WITH MONTHES NOT BY YEARS
        // let tempMonth = getTheMonth(payroll)


        // let monthIndex = new Date(payroll?.createdAt).getMonth()

        // monthes[monthIndex].push(payroll)
        // console.log(` at tempMOnth of ${tempMonth} monthes[${monthIndex}]=${monthes[monthIndex]}`)

        // years[tempYear][tempMonth] = monthes[monthIndex]

    });
    if (!Object.keys(years)[0]) {
        return res.status(400).send({
            error_en: "Payrolls Are Not Found ",
            error_ar: "لم يتم العثور على رواتب",
        });
    }
    res.status(200).send({
        success_en: "Payrolls are fetched successfully",
        success_ar: "تم جلب الرواتب بنجاح",
        years,
        payrolls: payrolls,
    });
};
