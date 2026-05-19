const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/', async (req, res) => {
  try {
    let about = await prisma.about.findFirst()
    if (!about) {
      about = await prisma.about.create({
        data: { content: '# 关于我\n\n欢迎来到我的博客！' }
      })
    }
    res.json({ flag: true, data: about })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取关于失败' })
  }
})

module.exports = router