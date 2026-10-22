
import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { initDatabase } from './db/init.js'
import { app } from './app.js'

try {
  await initDatabase()

  const PORT = process.env.PORT || 3000

  const httpServer = createServer(app)

  const io = new Server(httpServer, {
    cors: {
      origin: true,
    },
  })

  // Make Socket.IO available to the recipe routes
  app.set('io', io)

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id)

    // Existing real-time chat functionality
    socket.on('chat message', (message) => {
      io.emit('chat message', message)
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id)
    })
  })

  httpServer.listen(PORT, () => {
    console.info(`Express and Socket.IO server running on http://localhost:${PORT}`)
  })
} catch (err) {
  console.error('Error starting server:', err)
}
