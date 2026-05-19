const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/all', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { id: 'asc' } })
    res.json({ flag: true, data: tags })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取标签失败' })
  }
})

router.get('/topTen', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: { articles: true },
      take: 10
    })
    const sorted = tags.sort((a, b) => b.articles.length - a.articles.length)
    res.json({ flag: true, data: sorted.slice(0, 10) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取标签失败' })
  }
})

module.exports = router