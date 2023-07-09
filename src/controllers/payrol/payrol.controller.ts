import { NextFunction } from 'express'
import { AuthenticatedReq } from '../../middlewares/auth'
import { Router, Response } from 'express'
import Payrol from '../../models/payrol'
import { Roles } from '../../types/enums'
import moment from 'moment'
//DESC Get All The Payrol
//Route: GET /teamHR/api/v1/payrol
export const getAllPayRols = async (req: AuthenticatedReq, res: Response) => {
  const user = req.user
  let payrols
  if (user?.role === Roles.EMPLOYEE) {
    payrols = await Payrol.find({
      employee: user._id,
      shift: user.shift,
    }).populate('shift employee')
  } else {
    payrols = await Payrol.find({ branch: req.params.branch }).populate(
      'shift employee',
    )
  }

  if (payrols.length <= 0)
    return res
      .status(400)
      .send({ success: false, success_en: `Can't Find Payrols` })
  res
    .status(200)
    .send({
      success: true,
      message_en: 'Payrols Fetched Successfully',
      payrols,
      count: payrols.length,
    })
}

//DESC : Get PayRol ById
//Route : Get /teamHR/api/v1/payrol/:id
export const getPayrolById = async (req: AuthenticatedReq, res: Response) => {
  const payrolId = req.params.id
  const payrol = await Payrol.findById(payrolId)
  if (!payrol)
    return res.status(400).send({ success: false, message: 'Payrol Not Found' })
  res
    .status(200)
    .send({ success: true, message_en: 'Payrol Succesfully Fetched ' })
}
//DESC : Get PayRol ById
//Route : Get /teamHR/api/v1/payrol/:id
export const getPayrolEmployee = async (
  req: AuthenticatedReq,
  res: Response,
) => {
  const payrol = await Payrol.find({
    employee: req.user?._id,
  })
  if (!payrol)
    return res.status(400).send({ success: false, message: 'Payrol Not Found' })
  res
    .status(200)
    .send({ success: true, message_en: 'Payrols Succesfully Fetched ', payrol })
}
//DESC : Get PayRol ById
//Route : Get /teamHR/api/v1/payrol/:id
export const getPayrollsbyDepartment = async (
  req: AuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  const payrol = await Payrol.find({
    role: Roles.EMPLOYEE,
    department: req.query.department
  }).populate([
    { path: 'employee', model: "User" }
  ])
  if (!payrol)
    return res.status(400).send({ success: false, message: 'Payrol Not Found' })
  res
    .status(200)
    .send({ success: true, message_en: 'Payrols Succesfully Fetched ', payrol })
}
// // DESC : Get PayRol
// // Route: POST /TeamHR/api/v1/payrol/
// export const addPayrol=async(req:AuthenticatedReq,res:Response)=>{
//     const payrolExisted= await Payrol.findOne({employee:req.body.employee})
//     if(payrolExisted)
//         return res.status(500).send({success:false,message_en:'pay rol not found'})
//     const newPayrol=new Payrol({...req.body})
//     await newPayrol.save();
//     res.status(200).send({success:true,message:'new Payrol added'})

// }

// export const updatePayrol=async(req:AuthenticatedReq,res:Response)=>{
//     const id=req.params.id;

//     const payRolExisted=await Payrol.findByIdAndUpdate(id,{...req.body},{new:true})
//     if(!payRolExisted){
//         return res.status(400).send({success:true,message:'updated payrol successfully'})
//     }

// }



// i want to create A function to get the yearly payrol for the user 
// THE LOGIC WOULD BE CREATE OBJECT EACH KEY IS THE MONTH THEN USING THAT 
// CREATE THE LOGIC OF ANAGRAM TO GET THE FREQUENT COUNT OF THE USER DATA BASED ON THE MONTH 

export const getOneYearOfUserPayrol = async (req: AuthenticatedReq, res: Response) => {
  //1)create object of the monthes 
  const getTheMonth = (payrol: any) => {


    return moment(new Date(payrol?.createdAt).setMonth(new Date(payrol?.createdAt).getMonth())).format('MMMM')

  }




  // 1 need to get all the payrols for the user
  const payrols: any = await Payrol.find({ employee: req.params.userId })

  // getting an object of all the years of each payrol for the user
  let years: any = {}
  let monthes: any[] = []
  payrols.forEach((payrol: any, index: any) => {
    let tempYear = (new Date(payrol?.createdAt).getFullYear())

    if (!years[tempYear]) {
      years[tempYear] = []
    }
    // now we have this year lets to ity
    years[tempYear].push(payrol)


    for (let i = 0; i < 12; i++) {
      monthes.push([])

    }



    //THIS IS LOGIC TO GET IT WITH MONTHES NOT BY YEARS
    // let tempMonth = getTheMonth(payrol)


    // let monthIndex = new Date(payrol?.createdAt).getMonth()

    // monthes[monthIndex].push(payrol)
    // console.log(` at tempMOnth of ${tempMonth} monthes[${monthIndex}]=${monthes[monthIndex]}`)

    // years[tempYear][tempMonth] = monthes[monthIndex]

  })
  if (!Object.keys(years)[0]) {
    return res.status(400).send({ error_en: "Payrols Are Not Found ", error_ar: 'لم يتم العثور على رواتب' })
  }
  res.status(200).send({ success_en: "Payrols are fetched successfully", success_ar: 'تم جلب الرواتب بنجاح', years, payrols })
}
