const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/', async (req, res) => {
  try {
    const { current, size } = req.query
    const talks = await prisma.talk.findMany({
      where: { isDelete: false },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(current) - 1) * parseInt(size),
      take: parseInt(size)
    })
    const total = await prisma.talk.count({ where: { isDelete: false } })
    res.json({ flag: true, data: { records: talks, total } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取说说失败' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const talk = await prisma.talk.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { comments: { include: { user: true } } }
    })
    if (!talk || talk.isDelete) {
      return res.status(404).json({ flag: false, code: 40400, message: '说说不存在' })
    }
    res.json({ flag: true, data: talk })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取说说失败' })
  }
})

module.exports = router