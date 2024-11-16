import React, { createContext, useEffect, useContext, useState } from 'react'
import api from '@/utils/api'
import AuthContext from '@/utils/authContext'

let ws = null
let heartBeat = null
// being used for testing; remove later
//let messageCount = 0

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
  const [newChatMessages, setNewChatMessages] = useState([])

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

  // being used for testing; remove later
  // const simulateFakeMessage = () => {
  //   const fakeMessage = {
  //     messageId: `${messageCount}1-4e65-4877-852c-3024bcf3fa`,
  //     type: 'chat',
  //     sender: 'aecfea11-4e65-4877-852c-3024bcf3fa41',
  //     message: `Test message number ${messageCount}`
  //   }
  //   setNewChatMessages(prevMessages => [...prevMessages, fakeMessage])
  // }

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

    // being used for testing; remove later
    // const fakeMessageInterval = setInterval(() => {
    //   if (messageCount < 190) {
    //     simulateFakeMessage()
    //     messageCount += 1
    //   } else {
    //     clearInterval(fakeMessageInterval)
    //   }
    // }, 5000)

    return () => {
      clearWebSocketResources()
      // being used for testing; remove later
      // clearInterval(fakeMessageInterval)
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
