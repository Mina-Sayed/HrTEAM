"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentUser = exports.deleteDocument = exports.addDocument = void 0;
const Documents_1 = require("../../models/Documents");
//@desc         add a new document
//@route        POST /api/v1/document/
//@access       public
// a7a ya abdo :: adding document and save it witout returning it 
const addDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const document = new Documents_1.Document(Object.assign(Object.assign({}, req.body), { userId: userId }));
    yield document.save();
    res.send({
        success: true,
        message_en: 'Your file uploaded success',
        message_ar: 'تم حفظ الملف بنجاح ',
        document
    });
});
exports.addDocument = addDocument;
//@desc         delete a document
//@route        POST /api/v1/document/:id
//@access       private(employee,admin)
const deleteDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    const document = yield Documents_1.Document.findByIdAndDelete({
        _id: req.params.id,
        userId: userId,
    });
    if (!document)
        return res
            .status(400)
            .send({ error_en: 'Invalid Document', error_ar: 'مستند غير صالح' });
    res.send({
        success: true,
        message_en: 'Your file deleted success',
        message_ar: 'تم حذف الملف بنجاح ',
    });
});
exports.deleteDocument = deleteDocument;
//@desc         get all documents
//@route        GET /api/v1/document/:id
//@access       private(employee,admin)
const getDocumentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
    const documents = yield Documents_1.Document.find({
        userId: userId,
    });
    console.log('docdus: ', documents);
    if (!documents[0])
        return res
            .status(400)
            .send({ error_en: 'Invalid Document', error_ar: 'مستند غير صالح' });
    res.send({
        success: true,
        message_en: 'Your documents fetched success',
        message_ar: 'تم ارجاع الملفات بنجاح ',
        documents,
    });
});
exports.getDocumentUser = getDocumentUser;
