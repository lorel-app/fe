import React from 'react'
import { View, Text } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

const ChatBubble = ({ message, time, isSender }) => {
  const styles = useGlobalStyles()

  //2024-11-10T10:23:47.000Z
  return (
    <View
      style={[
        styles.bubble,
        isSender ? styles.senderBubble : styles.receiverBubble
      ]}
    >
      <Text style={styles.text}>{message}</Text>
      <Text
        style={[styles.textLight, { alignSelf: 'flex-end' }, { marginTop: 5 }]}
      >
        {time}
      </Text>
    </View>
  )
}

export default ChatBubble
