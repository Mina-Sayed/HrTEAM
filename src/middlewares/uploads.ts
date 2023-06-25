import multer from "multer"
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const index = file.originalname.indexOf('.')
        const type = file.originalname.slice(index)
        cb(null, file.fieldname + '-' + Date.now() + type)
    }
})
export const upload = multer({ storage: storage })