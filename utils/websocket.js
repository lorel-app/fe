import React, { createContext, useEffect, useState, useContext } from 'react'
import api from '@/utils/api'
import AuthContext from '@/utils/authContext'

let ws = null
let heartBeat = null

const WebSocketContext = createContext()

// 5s for debugging - change to 50s
const PING_INTERVAL = 5000

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
  const [messages, setMessages] = useState([])
  const { isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    const ping = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('Sending ping message...')
        const pingMessage = JSON.stringify({ type: 'ping' })
        ws.send(pingMessage)
      } else {
        console.log('WebSocket is not open. Current state:', ws.readyState)
      }
    }

    const setupWebSocketListeners = () => {
      if (!ws) return

      ws.onopen = () => {
        console.log('WebSocket opened')
        heartBeat = setInterval(ping, PING_INTERVAL)
      }

      ws.onmessage = event => {
        console.log('Message from server:', event.data)
        setMessages(prevMessages => [...prevMessages, event.data])
      }

      ws.onclose = event => {
        console.warn('WebSocket connection closed', event)
        clearWebSocketResources()
      }

      ws.onerror = error => {
        console.error('WebSocket error:', error)
        clearWebSocketResources()
      }
    }

    const createWebSocketConnection = wsUrl => {
      if (ws) {
        console.log('WebSocket already exists')
        return
      }
      ws = new WebSocket(wsUrl)
      setupWebSocketListeners()
    }

    const connectWebSocket = async () => {
      try {
        const tokens = await api.loadTokens()
        if (!tokens?.accessToken) {
          console.error('No access token available, cannot open WebSocket')
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
          console.log('Reauthenticating with refreshed token')
        }
      } else {
        console.log('Authenticating with new access token')
        connectWebSocket() // Fallback
      }
    }

    api.setOnTokenChangeCallback(handleTokenChange)

    if (isAuthenticated) {
      connectWebSocket()
    }

    return () => {
      clearWebSocketResources()
      api.setOnTokenChangeCallback(() => {})
    }
  }, [isAuthenticated])

  return (
    <WebSocketContext.Provider value={{ messages }}>
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
