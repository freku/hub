import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { getNamespaces } from '../utils/scriptNamespace.js'
import { redisClient, io } from '../globals/index.js'

const verifyToken = (socket, next) => {
  if (socket.handshake.headers && socket.handshake.headers.cookie) {
    const parsedCookies = cookie.parse(socket.handshake.headers.cookie)

    const jwtToken = parsedCookies.jwt_token

    if (jwtToken) {
      try {
        const decoded = jwt.verify(
          jwtToken,
          Buffer.from(process.env.JWT_SECRET, 'base64')
        )

        socket.decoded = decoded

        return next()
      } catch (invalidTokenError) {
        return next(new Error('Authentication error'))
      }
    }
  }

  return next(new Error('Authentication error'))
}

export default function () {
  io.use(verifyToken)

  io.on('connection', async (socket) => {
    const scriptName = socket.handshake.query.scriptName
    const { outputNamespace, statusNamespace } = getNamespaces(scriptName)

    console.log('a user connected on script ' + scriptName)

    socket.join(statusNamespace)
    socket.join(outputNamespace)

    socket.emit('script:output', await redisClient.get(outputNamespace))

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  io.of('/status').use(verifyToken)

  io.of('/status').on('connection', async (socket) => {
    console.log(
      'a user connected on status namespace with id ' + socket.decoded.id
    )

    const statusSockets = await io.of('/status').fetchSockets()

    for (const sock of statusSockets) {
      io.of('/status').emit('user:joined', sock.decoded.id)
    }

    socket.on('disconnect', () => {
      io.of('/status').emit('user:left', socket.decoded.id)

      console.log('user disconnected on status namespace')
    })
  })
}
