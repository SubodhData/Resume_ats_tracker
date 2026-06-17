const path = require('path');
const multer = require('multer');


//Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb)=> cb(null, 'upload/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error("only pdf allow"), false);
}
exports.upload = multer({ storage , fileFilter});