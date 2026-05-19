const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'aurora-secret-key'

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ flag: false, code: 40001, message: '用户未登录' })
  }
  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ flag: false, code: 40001, message: 'Token无效' })
  }
  req.user = decoded
  next()
}

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ flag: false, code: 40003, message: '无权限' })
  }
  next()
}

module.exports = { generateToken, verifyToken, authMiddleware, adminMiddleware }