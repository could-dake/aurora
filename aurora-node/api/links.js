const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/', async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      orderBy: { sort: 'asc' }
    })
    res.json({ flag: true, data: links })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取友链失败' })
  }
})

module.exports = router