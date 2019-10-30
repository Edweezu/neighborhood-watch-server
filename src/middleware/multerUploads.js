const multer = require('multer')
const Datauri = require('datauri')
const path = require('path')

//will save the file to memory first which can be manipulated but this makes the file come in as a buffer
const storage = multer.memoryStorage();

//should look for the field name image when searching for the file
const multerUploads = multer({ storage }).single('image');

const dUri = new Datauri();

//converts the image buffer to a base4 encoded string b/c cloudinary upload expects either a file path or a string
const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);


module.exports = {
    multerUploads,
    dataUri
}