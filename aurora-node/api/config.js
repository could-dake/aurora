const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/', async (req, res) => {
  try {
    let config = await prisma.websiteConfig.findFirst()
    if (!config) {
      config = await prisma.websiteConfig.create({
        data: {
          websiteName: 'Aurora Blog',
          websiteAvatar: '/images/avatar.jpg',
          websiteIntro: '一个优雅的博客',
          socialLogin: false,
          qqLogin: false,
          emailLogin: true
        }
      })
    }
    res.json({ flag: true, data: config })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取配置失败' })
  }
})

module.exports = router