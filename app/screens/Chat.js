import React, { useContext, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'
import AuthContext from '@/utils/authContext'
import UnauthenticatedView from '@/components/UnauthenticatedView'
import UserCard from '@/components/UserCard'
import api from '@/utils/api'
import Loader from '@/components/Loader'
import useFormatResponse from '@/hooks/useFormatResponse'

export default function ChatScreen() {
  const styles = useGlobalStyles()
  const { isAuthenticated, user } = useContext(AuthContext)
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const showAlert = useAlertModal()
  const navigation = useNavigation()
  const { truncate, timeAgo } = useFormatResponse()

  const fetchChats = async () => {
    if (loading || !hasMore || !isAuthenticated) return
    setLoading(true)
    try {
      const response = await api.allChats(12, offset)
      if (response.success) {
        setChats(prevChats => [...prevChats, ...response.data.conversations])
        setHasMore(response.data.conversations.length > 0)
        setOffset(prevOffset => prevOffset + response.data.conversations.length)
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
      setChats([])
      setOffset(0)
      setHasMore(true)
      fetchChats()
    }, [])
  )

  if (!isAuthenticated) {
    return <UnauthenticatedView />
  }

  const renderItem = ({ item: chat }) => (
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
      keyExtractor={item => item.id.toString()}
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
