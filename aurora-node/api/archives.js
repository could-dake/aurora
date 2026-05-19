const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/all', async (req, res) => {
  try {
    const { current, size } = req.query
    const articles = await prisma.article.findMany({
      where: { isDelete: false, status: 1 },
      select: { id: true, articleTitle: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    })
    const archives = []
    const map = new Map()
    articles.forEach(article => {
      const month = article.createdAt.toISOString().substring(0, 7)
      if (!map.has(month)) {
        map.set(month, [])
        archives.push({ month, articles: [] })
      }
      map.get(month).push(article)
    })
    archives.forEach(a => {
      a.articles = map.get(a.month)
    })
    const total = archives.length
    res.json({ flag: true, data: { records: archives, total } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取归档失败' })
  }
})

module.exports = router