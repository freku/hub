import { Server } from 'socket.io'
import pty from 'node-pty'

export default function bashRouteAndWebsockets(app, http, client) {
  const io = new Server(http, {
    cors: {
      origin: 'http://localhost:3001',
    },
  })

  app.get('/bash', async (req, res) => {
    const script = pty.spawn('bash', ['./script.sh'], {
      name: 'xterm-color',
      rows: 25,
      cols: 80,
      cwd: process.cwd(),
      env: process.env,
    })
    console.log('script started ' + Date())

    await client.del('script:output')

    script.onData(async (data) => {
      await client.append('script:output', data)

      const sockets = await io.fetchSockets()

      for (const socket of sockets) {
        socket.emit('script:output', data)
      }
    })
  })

  io.on('connection', async (socket) => {
    console.log('a user connected')

    socket.emit('script:output', await client.get('script:output'))

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
}
