import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import AuthContext from '@/utils/authContext'
import { useWebSocket } from '@/utils/websocket'
import UnauthenticatedView from '@/components/UnauthenticatedView'

export default function ChatScreen() {
  const { isAuthenticated } = useContext(AuthContext)
  const { messages } = useWebSocket()

  if (!isAuthenticated) {
    return <UnauthenticatedView />
  }

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Text>Messages:</Text>
        {messages.length === 0 ? (
          <Text>No messages yet</Text>
        ) : (
          messages.map((msg, index) => <Text key={index}>{msg}</Text>)
        )}
      </View>
    </ScrollView>
  )
}
