
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'

export function RecipeNotifications() {
  const [token] = useAuth()
  const [notification, setNotification] = useState(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!token) {
      return
    }

    const userId = jwtDecode(token).sub

    const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(
      /\/api\/v1\/?$/,
      '',
    )

    const socket = io(backendUrl)

    socket.on('recipe.added', (recipe) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })

      // Only notify users who did not create the recipe
      if (String(recipe.author) !== String(userId)) {
        setNotification(recipe)
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [token, queryClient])

  if (!token || !notification) {
    return null
  }

  return (
    <div
      role='alert'
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#e8f5e9',
        border: '2px solid #4caf50',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        maxWidth: '300px',
      }}
    >
      <button
        type='button'
        onClick={() => setNotification(null)}
        aria-label='Close notification'
        style={{
          float: 'right',
          cursor: 'pointer',
        }}
      >
        X
      </button>

      <h3>New Recipe Added!</h3>

      <p>{notification.title}</p>

      <Link
        to={`/recipes/${notification._id}`}
        onClick={() => setNotification(null)}
      >
        Click here to view recipe
      </Link>
    </div>
  )
}
