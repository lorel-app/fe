import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef
} from 'react'
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
import ReportModal from '@/components/Report'
import ButtonIcon from '@/components/ButtonIcon'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

const MessageScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const { userId, showHeader = true } = route.params || {}
  const { user: me } = useContext(AuthContext)
  const [user, setUser] = useState({})
  const [conversationId, setConversationId] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const showAlert = useAlertModal()
  const [isReportModalVisible, setIsReportModalVisible] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const getUser = async () => {
    const response = await api.getUser(userId)
    setUser(response.data.user)
  }

  useEffect(() => {
    getUser()
  }, [userId])

  const { sendChatMessage, newChatMessages } = useWebSocket()
  const flatListRef = useRef()

  const handleSend = message => {
    const myUUID = uuidv4()
    if (message.trim()) {
      setIsSending(true)
      const newMessage = {
        id: myUUID,
        userId: me.id,
        message: message,
        createdAt: new Date().toISOString(),
        status: 'SENT'
      }
      setMessages(prevMessages => [newMessage, ...prevMessages])
      sendChatMessage(userId, message)
      setIsSending(false)

      setTimeout(() => {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
      }, 300)
    }
  }

  const fetchMessages = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const response = await api.getChat(userId, 12, offset)
      if (response.success) {
        setConversationId(response.data.conversationId)
        const fetchedMessages = response.data.messages

        setHasMore(fetchedMessages.length > 0)
        setOffset(prevOffset => prevOffset + fetchedMessages.length)

        const filteredFetchedMessages = fetchedMessages.filter(
          fetchedMessage =>
            !messages.some(
              existingMessage => existingMessage.id === fetchedMessage.id
            )
        )

        setMessages(prevMessages => [
          ...prevMessages,
          ...filteredFetchedMessages
        ])
        // setHasMore(filteredFetchedMessages.length > 0)
        //   setOffset(prevOffset => prevOffset + filteredFetchedMessages.length)
      } else {
        showAlert(
          'error',
          'Please check your internet connection or try again later'
        )
      }
    } catch (error) {
      console.error('Failed to fetch messages', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (newChatMessages && Array.isArray(newChatMessages) && !loading) {
      setMessages(prevMessages => {
        const filteredMessages = newChatMessages.filter(newMessage => {
          return !prevMessages.some(
            existingMessage => existingMessage.id === newMessage.messageId
          )
        })

        const newMessages = filteredMessages
          .map(newMessage => {
            if (newMessage.conversationId === conversationId) {
              return {
                id: newMessage.messageId,
                userId: newMessage.sender,
                message: newMessage.message,
                createdAt: new Date().toISOString()
              }
            }
            return null
          })
          .filter(Boolean)

        return [...newMessages, ...prevMessages]
      })
    }
  }, [newChatMessages, loading, conversationId])

  useFocusEffect(
    React.useCallback(() => {
      getUser()
      fetchMessages()
    }, [userId])
  )

  const renderItem = useCallback(
    ({ item: message }) => {
      const isSender = me.id === message.userId
      return (
        <View style={{ width: '100%' }}>
          <ChatBubble
            message={message.message}
            time={message.createdAt}
            status={message.status}
            isSender={isSender}
          />
        </View>
      )
    },
    [me]
  )

  return (
    <>
      {showHeader && (
        <>
          <HeaderStack
            title={user.username}
            user={me}
            hideFollowButton={false}
          />
          <View style={styles.reportButton}>
            <ButtonIcon
              iconName="priority-high"
              iconColor={colors.primary}
              style={styles.iconSmall}
              onPress={() => setIsReportModalVisible(true)}
            />
          </View>
        </>
      )}
      {!loading && messages.length === 0 && (
        <View style={[styles.containerFull]}>
          <Text style={[styles.buttonSmall, styles.text]}>
            Chats are not end-to-end encrypted yet.{'\n'} Do not share any
            sensitive information.
          </Text>
        </View>
      )}
      <FlatList
        data={messages}
        ref={flatListRef}
        renderItem={renderItem}
        maxToRenderPerBatch={12}
        inverted={true}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[
          { flexGrow: 1 },
          { width: '100%' },
          { maxWidth: 600 },
          { minWidth: 300 },
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
        isSending={isSending}
      />
      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        id={conversationId}
        type="CONVERSATION"
      />
    </>
  )
}

export default MessageScreen
