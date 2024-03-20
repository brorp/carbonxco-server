const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const parseFile = upload.single('file')

module.exports = {parseFile}