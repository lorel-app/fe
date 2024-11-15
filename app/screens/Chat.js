import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useWebSocket } from '@/utils/websocket'
import UserCard from '@/components/UserCard'
import api from '@/utils/api'
import Loader from '@/components/Loader'
import useFormatResponse from '@/hooks/useFormatResponse'

export default function ChatScreen() {
  const styles = useGlobalStyles()
  const [chats, setChats] = useState([])
  const { newChatMessages, clearNewChatMessages } = useWebSocket()
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const showAlert = useAlertModal()
  const navigation = useNavigation()
  const { truncate, timeAgo } = useFormatResponse()

  const fetchChats = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const response = await api.allChats(12, offset)
      if (response.success) {
        // previous
        // setChats(prevChats => [...prevChats, ...response.data.conversations])
        setChats(prevChats => {
          const newChats = [...prevChats, ...response.data.conversations]
          // Remove duplicates based on user.id in the case newMessage is received at same time as fetchPosts
          const uniqueChats = newChats.filter(
            (chat, index, self) =>
              index === self.findIndex(c => c.user.id === chat.user.id)
          )
          return uniqueChats
        })
        setHasMore(response.data.conversations.length > 0)
        setOffset(prevOffset => prevOffset + response.data.conversations.length)
        console.log(chats)
      } else {
        showAlert(
          'error',
          `${response.data.message}: Please check your internet connection or try again later`
        )
      }
    } catch (error) {
      console.error('Failed to fetch chats', error.message)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      clearNewChatMessages()
      fetchChats()
    }, [])
  )

  useEffect(() => {
    if (newChatMessages.length > 0) {
      setChats(prevChats => {
        return newChatMessages.reduce((updatedChats, newMessage) => {
          const existingChatIndex = updatedChats.findIndex(
            chat => chat.user.id === newMessage.sender
          )

          if (existingChatIndex !== -1) {
            updatedChats[existingChatIndex] = {
              ...updatedChats[existingChatIndex],
              lastMessage: {
                message: newMessage.message
              },
              lastMessageAt: new Date().toISOString()
            }
            const updatedChatsList = [
              updatedChats[existingChatIndex],
              ...updatedChats.slice(0, existingChatIndex),
              ...updatedChats.slice(existingChatIndex + 1)
            ]
            return updatedChatsList
          } else {
            updatedChats.unshift({
              id: `${newMessage.sender}-${new Date().toISOString()}`,
              user: { id: newMessage.sender, username: 'temp' },
              lastMessage: {
                message: newMessage.message
              },
              lastMessageAt: new Date().toISOString()
            })
          }
          return updatedChats
        }, prevChats)
      })
    }
  }, [newChatMessages])

  const renderItem = useCallback(
    ({ item: chat }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Message', { userId: chat.user.id })
          }}
        >
          <UserCard user={chat.user}>
            <Text style={styles.textBold}>
              {truncate(chat.lastMessage.message, 35)}
            </Text>
            <Text style={styles.textLight}>{timeAgo(chat.lastMessageAt)}</Text>
          </UserCard>
        </TouchableOpacity>
      )
    },
    [navigation, truncate, timeAgo]
  )

  const chatHeader = () => (
    <View style={[{ marginVertical: 15 }, styles.buttonSmall]}>
      <Text style={styles.textSmall}>
        Chats are not end-to-end encrypted yet.{'\n'}
        Do not share any sensitive information.
      </Text>
    </View>
  )

  return (
    <FlatList
      data={chats}
      keyExtractor={item => item.user.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      onEndReached={fetchChats}
      ListHeaderComponent={chatHeader}
      ListEmptyComponent={
        !loading && (
          <View style={styles.containerFull}>
            <Text style={styles.title}>No chats yet</Text>
          </View>
        )
      }
      ListFooterComponent={loading && <Loader />}
    />
  )
}
