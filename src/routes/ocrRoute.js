const express = require('express')
const router = new express.Router()
const multer = require('multer')
const {ocr, extractTextFromPDF } = require('../utils/tesseract')

const storage = multer.memoryStorage()
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
            return cb(new Error('Please upload an image (jpg, jpeg, or png) or PDF file only'))
        }
        cb(undefined, true)
    }, 
    storage:storage
})
router.post('/extracttextfromimage', upload.single('document'),async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).send('error: No file uploaded')
        }
        // const textExtracted = await ocr(req.file.buffer)
        let textExtracted;
        if (req.file.originalname.endsWith('.pdf')) {
          textExtracted = await extractTextFromPDF(req.file.buffer);
        } else {
          textExtracted = await ocr(req.file.buffer);
        }
    
        res.send({textExtracted})
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error')
    }
})

module.exports = router