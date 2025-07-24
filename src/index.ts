import express from 'express'
import connectDatabase from './config/database'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import { setupSwagger } from './config/swagger'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import './config/cronJobs'
import './config/auth'
import session from 'express-session'
import { initSocket } from './socket'

import authRoutes from './routers/auth.routes'
import uploadRoute from './routers/upload.routes'
import uploadDriveRoute from './routers/uploaddrive.routes'
import videoRoute from './routers/video.routes'
import playlistRoute from './routers/playlist.routes'
import categoryRoute from './routers/category.routes'
import tagRoute from './routers/tag.routes'
import channelRoute from './routers/channel.routes'
import commentRoute from './routers/comment.routes'
import subcriptionRoute from './routers/subcription.routes'
import notificationRoute from './routers/notification.routes'
import likeRoute from './routers/like.routes'
import { createServer } from 'http'

dotenv.config()
const app = express()
const server = createServer(app)
const io = initSocket(server)

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

const databaseUrl = process.env.DATABASE_URL as string
connectDatabase(databaseUrl)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
)
app.use(passport.session())

setupSwagger(app)
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Không có đâu!')
})

app.use((req: any, res, next) => {
  req.io = io
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoute)
app.use('/api/upload/drive', uploadDriveRoute)
app.use('/api/video', videoRoute)
app.use('/api/playlist', playlistRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/tags', tagRoute)
app.use('/api/channel', channelRoute)
app.use('/api/comments', commentRoute)
app.use('/api/subcription', subcriptionRoute)
app.use('/api/notification', notificationRoute)
app.use('/api/vote', likeRoute)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

// CommonJS (require)
// ES Modules (import)
