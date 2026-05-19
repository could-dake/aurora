const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const { authMiddleware } = require('../utils/auth')

router.get('/', async (req, res) => {
  try {
    const { current, size, articleId } = req.query
    const where = { isDelete: false, isReview: true, parentId: null }
    if (articleId) where.articleId = parseInt(articleId)
    
    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(current) - 1) * parseInt(size),
      take: parseInt(size),
      include: { user: { select: { id: true, nickname: true, avatar: true } } }
    })
    const total = await prisma.comment.count({ where })
    res.json({ flag: true, data: { records: comments, total } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取评论失败' })
  }
})

router.get('/topSix', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { isDelete: false, isReview: true, parentId: null },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { user: { select: { id: true, nickname: true, avatar: true } }, article: true }
    })
    res.json({ flag: true, data: comments })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取评论失败' })
  }
})

router.get('/:commentId/replies', async (req, res) => {
  try {
    const replies = await prisma.comment.findMany({
      where: { parentId: parseInt(req.params.commentId), isDelete: false, isReview: true },
      include: { user: { select: { id: true, nickname: true, avatar: true } } }
    })
    res.json({ flag: true, data: replies })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取回复失败' })
  }
})

router.post('/save', async (req, res) => {
  try {
    const { articleId, talkId, commentContent, parentId, userId } = req.body
    const comment = await prisma.comment.create({
      data: {
        articleId: articleId ? parseInt(articleId) : null,
        talkId: talkId ? parseInt(talkId) : null,
        parentId: parentId ? parseInt(parentId) : null,
        userId: userId ? parseInt(userId) : null,
        commentContent,
        isReview: true
      }
    })
    res.json({ flag: true, data: comment })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '评论失败' })
  }
})

module.exports = router