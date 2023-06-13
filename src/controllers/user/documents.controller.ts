import {AuthenticatedReq} from '../../middlewares/auth';
import {Document} from '../../models/document';
import {Response} from 'express';
//@desc         add a new document
//@route        POST /api/v1/document/
//@access       public
// a7a ya abdo :: adding document and save it witout returning it 
export const addDocument = async (req: AuthenticatedReq, res: Response) =>
{
    const userId = req.user?._id;
    const document = new Document({
        ...req.body,
        userId: userId,
    });
    await document.save();
    res.send({
        success: true,
        message_en: 'Your file uploaded success',
        message_ar: 'تم حفظ الملف بنجاح ',
        document
    });
};
//@desc         delete a document
//@route        POST /api/v1/document/:id
//@access       private(employee,admin)
export const deleteDocument = async (req: AuthenticatedReq, res: Response) =>
{
    const userId = req.user?._id;
    const document = await Document.findByIdAndDelete({
        _id: req.params.id,
        userId: userId,
    });
    if (!document)
        return res
            .status(400)
            .send({error_en: 'Invalid Document', error_ar: 'مستند غير صالح'});
    res.send({
        success: true,
        message_en: 'Your file deleted success',
        message_ar: 'تم حذف الملف بنجاح ',
    });
};
//@desc         get all documents
//@route        GET /api/v1/document/:id
//@access       private(employee,admin)
export const getDocumentUser = async (req: AuthenticatedReq, res: Response) =>
{
    const userId = req.user?._id;
    const documents: any = await Document.find({
        userId: userId,
    });
    console.log('docdus: ', documents);
    if (!documents[0])
        return res
            .status(400)
            .send({error_en: 'Invalid Document', error_ar: 'مستند غير صالح'});
    res.send({
        success: true,
        message_en: 'Your documents fetched success',
        message_ar: 'تم ارجاع الملفات بنجاح ',
        documents,
    });
};
