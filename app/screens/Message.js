import React, { useState, useContext, useEffect } from 'react'
import { useTheme, useFocusEffect } from '@react-navigation/native'
import { FlatList, Text, View } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'
import api from '@/utils/api'
import HeaderStack from '../navigation/HeaderStack'
import SendInputBar from '@/components/SendInputBar'
import Loader from '@/components/Loader'
import AuthContext from '@/utils/authContext'
import ChatBubble from '@/components/ChatBubble'
import { useWebSocket } from '@/utils/websocket'

const MessageScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const { userId, showHeader = true } = route.params || {}
  const { user: me } = useContext(AuthContext)
  const [user, setUser] = useState({})
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const showAlert = useAlertModal()

  const getUser = async () => {
    const response = await api.getUser(userId)
    setUser(response.data.user)
  }

  useEffect(() => {
    getUser()
  }, [userId])

  const { sendChatMessage } = useWebSocket()

  // const handleSend = message => {
  //   if (message.trim()) {
  //     sendChatMessage(userId, message)
  //   }
  // }
  const handleSend = message => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        userId: me.id,
        message: message,
        createdAt: new Date().toISOString(),
        status: 'SENT'
      }

      setMessages(prevMessages => [newMessage, ...prevMessages])

      sendChatMessage(userId, message)
    }
  }

  const fetchMessages = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const response = await api.getChat(userId, 12, offset)
      if (response.success) {
        setMessages(prevMessages => [
          ...prevMessages,
          ...response.data.messages
        ])
        setHasMore(response.data.messages.length > 0)
        setOffset(prevOffset => prevOffset + response.data.messages.length)
      } else {
        showAlert(
          'error',
          `${response.data.message}: Please check your internet connection or try again later`
        )
      }
    } catch (error) {
      console.error('Failed to fetch messages', error.message)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getUser()
      setMessages([])
      setOffset(0)
      fetchMessages()
    }, [userId])
  )

  const renderItem = ({ item: message }) => {
    const isSender = me.id === message.userId
    return (
      <ChatBubble
        message={message.message}
        time={message.createdAt}
        status={message.status}
        isSender={isSender}
      />
    )
  }

  return (
    <>
      {showHeader && (
        <HeaderStack title={user.username} user={me} hideFollowButton={false} />
      )}
      {!loading && messages.length === 0 && (
        <View style={[styles.containerFull]}>
          <Text style={styles.buttonSmall}>
            Chats are not end-to-end encrypted yet.{'\n'}
            Do not share any sensitive information.
          </Text>
        </View>
      )}
      <FlatList
        data={messages}
        renderItem={renderItem}
        maxToRenderPerBatch={12}
        inverted={true}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[
          { flexGrow: 1 },
          { maxWidth: 600 },
          { alignSelf: 'center' }
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={fetchMessages}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <Loader />}
      />
      <SendInputBar
        onSend={handleSend}
        placeholder="Send a message..."
        placeholderTextColor={colors.text}
      />
    </>
  )
}

export default MessageScreen
