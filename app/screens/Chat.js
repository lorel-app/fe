import React, { useContext } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import AuthContext from '@/utils/authContext'
import { useWebSocket } from '@/utils/websocket'
import UnauthenticatedView from '@/components/UnauthenticatedView'
import UserCard from '@/components/UserCard'

export default function ChatScreen() {
  const styles = useGlobalStyles()
  const { isAuthenticated, user } = useContext(AuthContext)
  const { messages } = useWebSocket()

  if (!isAuthenticated) {
    return <UnauthenticatedView />
  }

  const renderItem = ({ item }) => (
    <UserCard user={user}>
      <Text>{item}</Text>
    </UserCard>
  )

  return (
    <>
      {messages.length === 0 ? (
        <Text>No chats yet</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />
      )}
    </>
  )
}
