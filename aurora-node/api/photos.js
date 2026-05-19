const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/albums', async (req, res) => {
  try {
    const albums = await prisma.photoAlbum.findMany({
      include: { photos: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ flag: true, data: albums })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取相册失败' })
  }
})

router.get('/:albumId/photos', async (req, res) => {
  try {
    const { current, size } = req.query
    const photos = await prisma.photo.findMany({
      where: { albumId: parseInt(req.params.albumId) },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(current) - 1) * parseInt(size),
      take: parseInt(size)
    })
    const total = await prisma.photo.count({ where: { albumId: parseInt(req.params.albumId) } })
    res.json({ flag: true, data: { records: photos, total } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取照片失败' })
  }
})

module.exports = router