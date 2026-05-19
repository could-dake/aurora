const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const prisma = require('../prisma')
const { generateToken, authMiddleware } = require('../utils/auth')

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return res.json({ flag: false, code: 40000, message: '用户名或密码错误' })
    }
    if (user.isDisable) {
      return res.json({ flag: false, code: 40000, message: '账号已被禁用' })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.json({ flag: false, code: 40000, message: '用户名或密码错误' })
    }
    const token = generateToken(user)
    res.json({ 
      flag: true, 
      data: { token, userInfo: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar, role: user.role } }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '登录失败' })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { username, password, code, email } = req.body
    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) {
      return res.json({ flag: false, code: 40000, message: '用户名已存在' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, email, nickname: username }
    })
    const token = generateToken(user)
    res.json({ 
      flag: true, 
      data: { token, userInfo: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar, role: user.role } }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '注册失败' })
  }
})

router.put('/info', authMiddleware, async (req, res) => {
  try {
    const { nickname, avatar } = req.body
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { nickname, avatar }
    })
    res.json({ flag: true, data: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar, role: user.role } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '更新失败' })
  }
})

router.get('/info/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { id: true, nickname: true, avatar: true, email: true }
    })
    if (!user) {
      return res.status(404).json({ flag: false, code: 40400, message: '用户不存在' })
    }
    res.json({ flag: true, data: user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '获取用户信息失败' })
  }
})

router.post('/logout', authMiddleware, async (req, res) => {
  res.json({ flag: true })
})

router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    const valid = await bcrypt.compare(oldPassword, user.password)
    if (!valid) {
      return res.json({ flag: false, code: 40000, message: '原密码错误' })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    })
    res.json({ flag: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '修改密码失败' })
  }
})

router.get('/code', async (req, res) => {
  res.json({ flag: true })
})

router.put('/email', authMiddleware, async (req, res) => {
  try {
    const { email, code } = req.body
    await prisma.user.update({
      where: { id: req.user.id },
      data: { email }
    })
    res.json({ flag: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ flag: false, code: 50000, message: '绑定邮箱失败' })
  }
})

router.put('/subscribe', authMiddleware, async (req, res) => {
  res.json({ flag: true })
})

router.post('/oauth/qq', async (req, res) => {
  res.status(501).json({ flag: false, code: 50100, message: 'QQ登录暂未支持' })
})

module.exports = router