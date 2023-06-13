import {NextFunction, Response} from 'express';
import User from '../../models/user';
import {AuthenticatedReq} from '../auth';
import {Company} from '../../models/company';
import Category from '../../models/category';

export const authCategory = (type: string, mode?: string) =>
    async function (req: AuthenticatedReq, res: Response, next: NextFunction)
    {
        //Obtaining user to know who is owner
        const user: any = await User.findOne({_id: req.user?._id});
        let owner;
        // If the user is a root, he gets his companies
        if (user.role === 'root') {
            owner = user._id;
        }
        // If the user is an admin, he gets his owner and gets his companies
        else if (user.role === 'admin') {
            const company: any = await Company.findOne({_id: user.company});
            owner = company.owner;
        }
        // If the user is an employee, he gets his owner and gets his companies
        else if (user.role === 'employee') {
            const company: any = await Company.findOne({_id: user.company});
            owner = company.owner;
        }
        //Obtaining companies owner
        const companiesId: any = (
            await Company.find({owner: owner})
        ).map((company) => company._id.toString());
        //Data of body
        let {company} = req.body;
        if (
            type === 'category' &&
            (user.role === 'admin' ||
                user.role === 'root' ||
                user.role === 'employee')
        ) {
            const error = {
                error_en: `You cannot (add or update or get or delete) any ${type} in the company because you are not the owner of the company`,
            };
            if (mode === 'post') {
                if (!companiesId.includes(company)) return res.status(401).send(error);
            } else if (mode === 'get' || 'put' || 'delete') {
                const {company} = req.query;
                if (
                    !companiesId.includes(req.user?.company) &&
                    !company &&
                    !req.params.id
                )
                    return res.status(401).send(error);
                else if (company && !companiesId.includes(company) && !req.params.id)
                    return res.status(401).send(error);
                else if (req.params.id && !company) {
                    const category: any = await Category.findOne({_id: req.params.id});
                    const companyId = category.company && category.company.toString();
                    if (!category || !companiesId.includes(companyId))
                        return res.status(401).send(error);
                }
            }
        }
        next();
    };
