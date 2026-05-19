const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/topAndFeatured', async (req, res) => {
  try {
    const topArticles = await prisma.article.findMany({
      where: { isDelete: false, status: 1 },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { category: true, tags: { include: { tag: true } } }
    })
    const featuredArticles = await prisma.article.findMany({
      where: { isDelete: false, status: 1, isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true }
    })
    res.json({ flag: true, data: { topArticles, featuredArticles } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取文章失败' })
  }
})

router.get('/all', async (req, res) => {
  try {
    const { current, size, categoryId, tagId } = req.query
    const where = { isDelete: false, status: 1 }
    if (categoryId) where.categoryId = parseInt(categoryId)
    
    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(current) - 1) * parseInt(size),
      take: parseInt(size),
      include: { category: true, tags: { include: { tag: true } } }
    })
    const total = await prisma.article.count({ where })
    res.json({ flag: true, data: { records: articles, total } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取文章失败' })
  }
})

router.get('/categoryId', async (req, res) => {
  try {
    const { current, size, categoryId } = req.query
    const articles = await prisma.article.findMany({
      where: { isDelete: false, status: 1, categoryId: parseInt(categoryId) },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(current) - 1) * parseInt(size),
      take: parseInt(size),
      include: { category: true, tags: { include: { tag: true } } }
    })
    const total = await prisma.article.count({ where: { categoryId: parseInt(categoryId), isDelete: false, status: 1 } })
    res.json({ flag: true, data: { records: articles, total } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取文章失败' })
  }
})

router.get('/tagId', async (req, res) => {
  try {
    const { current, size, tagId } = req.query
    const articles = await prisma.articleTag.findMany({
      where: { tagId: parseInt(tagId) },
      include: { article: { include: { category: true, tags: { include: { tag: true } } } } },
      skip: (parseInt(current) - 1) * parseInt(size),
      take: parseInt(size)
    })
    const total = await prisma.articleTag.count({ where: { tagId: parseInt(tagId) } })
    res.json({ flag: true, data: { records: articles.map(at => at.article), total } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取文章失败' })
  }
})

router.get('/search', async (req, res) => {
  try {
    const { current, size, keywords } = req.query
    const articles = await prisma.article.findMany({
      where: { 
        isDelete: false, 
        status: 1,
        OR: [
          { articleTitle: { contains: keywords } },
          { articleContent: { contains: keywords } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(current) - 1) * parseInt(size),
      take: parseInt(size),
      include: { category: true }
    })
    const total = await prisma.article.count({ 
      where: { isDelete: false, status: 1, OR: [{ articleTitle: { contains: keywords } }, { articleContent: { contains: keywords } }] }
    })
    res.json({ flag: true, data: { records: articles, total } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '搜索失败' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true, tags: { include: { tag: true } } }
    })
    if (!article || article.isDelete) {
      return res.status(404).json({ flag: false, code: 40400, message: '文章不存在' })
    }
    res.json({ flag: true, data: article })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取文章失败' })
  }
})

router.post('/access', async (req, res) => {
  try {
    const { articleId } = req.body
    await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: { views: { increment: 1 } }
    })
    res.json({ flag: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '统计失败' })
  }
})

module.exports = router