const express = require('express')
const router = express.Router()
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const { cloudinary } = require('../utils/cloudinary')
const { authMiddleware } = require('../utils/auth')

const upload = multer({ storage: multer.memoryStorage() })

router.post('/image', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ flag: false, message: '请选择文件' })
    }
    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
      folder: 'aurora',
      public_id: uuidv4()
    })
    res.json({ flag: true, data: { url: result.secure_url } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '上传失败' })
  }
})

module.exports = router