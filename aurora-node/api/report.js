const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  // 简单的访问统计
  res.json({ flag: true })
})

module.exports = router