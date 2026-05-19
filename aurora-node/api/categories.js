const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/all', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' }
    })
    res.json({ flag: true, data: categories })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取分类失败' })
  }
})

module.exports = router