import React, { createContext, useEffect, useContext, useState } from 'react'
import api from '@/utils/api'
import AuthContext from '@/utils/authContext'

let ws = null
let heartBeat = null

const WebSocketContext = createContext()

const PING_INTERVAL = 50000
const MAX_RETRY_DELAY = 30000

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
  const [newChatMessages, setNewChatMessages] = useState([])
  const [retryDelay, setRetryDelay] = useState(2000)

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
  const clearNewChatMessages = () => {
    setNewChatMessages([])
  }

  // useEffect(() => {
  //   console.log(newChatMessages, 'FROM WS')
  // }, [newChatMessages])

  useEffect(() => {
    const ping = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const pingMessage = JSON.stringify({ type: 'ping' })
        ws.send(pingMessage)
      }
    }

    const setupWebSocketListeners = () => {
      if (!ws) return

      ws.onopen = () => {
        heartBeat = setInterval(ping, PING_INTERVAL)
        setRetryDelay(2000)
      }

      ws.onmessage = event => {
        try {
          const parsedData = JSON.parse(event.data)

          if (parsedData.type === 'chat') {
            setNewChatMessages(prevMessages => [...prevMessages, parsedData])
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error)
        }
      }

      ws.onclose = () => {
        clearWebSocketResources()
        if (isAuthenticated) {
          handleReconnect()
        }
      }

      ws.onerror = () => {
        clearWebSocketResources()
        if (isAuthenticated) {
          handleReconnect()
        }
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

    const handleReconnect = () => {
      // inform Chat Screen when retrying and handle success/fail
      setTimeout(() => {
        connectWebSocket()
        setRetryDelay(prevDelay => Math.min(prevDelay * 2, MAX_RETRY_DELAY)) // Exponential backoff with max cap
      }, retryDelay)
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
    } else {
      clearWebSocketResources()
    }

    return () => {
      clearWebSocketResources()
      api.setOnTokenChangeCallback(() => {})
    }
  }, [isAuthenticated])

  return (
    <WebSocketContext.Provider
      value={{ newChatMessages, clearNewChatMessages, sendChatMessage }}
    >
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
