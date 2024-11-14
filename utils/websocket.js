import React, { createContext, useEffect, useContext } from 'react'
import api from '@/utils/api'
import AuthContext from '@/utils/authContext'

let ws = null
let heartBeat = null

const WebSocketContext = createContext()

const PING_INTERVAL = 50000

const clearWebSocketResources = () => {
  if (heartBeat) {
    clearInterval(heartBeat)
    heartBeat = null
  }
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close()
  }
  ws = null
}

export const WebSocketProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)

  const sendChatMessage = (userId, message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const chatMessage = JSON.stringify({
        type: 'chat',
        recipient: userId,
        message
      })
      ws.send(chatMessage)
    }
  }

  useEffect(() => {
    const ping = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('Sending ping message...')
        const pingMessage = JSON.stringify({ type: 'ping' })
        ws.send(pingMessage)
      }
    }

    const setupWebSocketListeners = () => {
      if (!ws) return

      ws.onopen = () => {
        heartBeat = setInterval(ping, PING_INTERVAL)
      }

      ws.onmessage = event => {
        console.log('Handle responses', event)
      }

      ws.onclose = () => {
        clearWebSocketResources()
      }

      ws.onerror = error => {
        console.error('WebSocket error:', error)
        clearWebSocketResources()
      }
    }

    const createWebSocketConnection = wsUrl => {
      if (ws) {
        return
      }
      ws = new WebSocket(wsUrl)
      setupWebSocketListeners()
    }

    const connectWebSocket = async () => {
      try {
        const tokens = await api.loadTokens()
        if (!tokens?.accessToken) {
          return
        }

        const wsUrl = `${process.env.EXPO_PUBLIC_WEBSOCKET_URL}?auth=${tokens.accessToken}`
        createWebSocketConnection(wsUrl)
      } catch (error) {
        console.error('Error creating WebSocket connection:', error)
      }
    }

    const handleTokenChange = async () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const tokens = await api.loadTokens()
        const accessToken = tokens?.accessToken

        if (accessToken) {
          ws.send(
            JSON.stringify({
              type: 'session',
              auth: accessToken
            })
          )
        }
      } else {
        connectWebSocket() // Fallback
      }
    }

    api.setOnTokenChangeCallback(handleTokenChange)

    if (isAuthenticated) {
      connectWebSocket()
    } else return

    return () => {
      clearWebSocketResources()
      api.setOnTokenChangeCallback(() => {})
    }
  }, [isAuthenticated])

  return (
    <WebSocketContext.Provider value={{ sendChatMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)

  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }

  return context
}
