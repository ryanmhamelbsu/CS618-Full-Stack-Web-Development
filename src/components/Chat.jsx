import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User } from './User.jsx'

export function Chat() {
  const [token] = useAuth()
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const userId = token ? jwtDecode(token).sub : null

  useEffect(() => {
    if (!token) {
      return
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/api\/v1\/?$/, '')

    const newSocket = io(backendUrl)

    newSocket.on('chat message', (newMessage) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        newMessage,
      ])
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [token])

  const sendMessage = (e) => {
    e.preventDefault()

    if (!message.trim() || !socket) {
      return
    }

    socket.emit('chat message', {
      userId,
      text: message,
      timestamp: new Date().toISOString(),
    })

    setMessage('')
  }

  if (!token) {
    return (
      <div>
        <h2>Recipe Chat</h2>
        <p>Log in to participate in the chat.</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Recipe Chat</h2>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          width: '500px',
          maxWidth: '100%',
          height: '250px',
          overflowY: 'auto',
          marginBottom: '10px',
        }}
      >
        {messages.length === 0 && (
          <p>No messages yet. Start the conversation!</p>
        )}

        {messages.map((chatMessage, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>
              <User id={chatMessage.userId} />
            </strong>
            : {chatMessage.text}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage}>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type a message...'
          style={{ width: '350px', maxWidth: '70%' }}
        />

        <button type='submit'>
          Send
        </button>
      </form>
    </div>
  )
}