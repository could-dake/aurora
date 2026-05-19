require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const articlesRouter = require('./api/articles')
const categoriesRouter = require('./api/categories')
const tagsRouter = require('./api/tags')
const usersRouter = require('./api/users')
const commentsRouter = require('./api/comments')
const photosRouter = require('./api/photos')
const talksRouter = require('./api/talks')
const linksRouter = require('./api/links')
const aboutRouter = require('./api/about')
const configRouter = require('./api/config')
const uploadRouter = require('./api/upload')
const reportRouter = require('./api/report')

app.use('/api/articles', articlesRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/users', usersRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/photos', photosRouter)
app.use('/api/albums', photosRouter)
app.use('/api/talks', talksRouter)
app.use('/api/links', linksRouter)
app.use('/api/about', aboutRouter)
app.use('/api', configRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/report', reportRouter)

app.get('/api/archives/all', require('./api/archives'))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ flag: false, code: 50000, message: '服务器内部错误' })
})

module.exports = app