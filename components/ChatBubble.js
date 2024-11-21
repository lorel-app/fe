import React from 'react'
import { View, Text } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import useFormatResponse from '@/hooks/useFormatResponse'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '@react-navigation/native'

const ChatBubble = ({ message, time, status, isSender }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const { formatTime } = useFormatResponse()

  const statusIcon = {
    SENT: { name: 'check', color: colors.secondary },
    DELIVERED: { name: 'done-all', color: colors.secondary },
    READ: { name: 'done-all', color: colors.tertiary }
  }

  const currentStatus = statusIcon[status] || statusIcon['SENT']

  return (
    <View
      style={[
        styles.bubble,
        isSender ? styles.senderBubble : styles.receiverBubble
      ]}
    >
      <View style={styles.bubbleContent}>
        <Text style={[styles.text, { marginBottom: 5 }]}>{message}</Text>
        <View style={isSender && styles.rowEnd}>
          <Text style={[styles.textLight, { fontWeight: '500' }]}>
            {formatTime(time)}
          </Text>
          {isSender && (
            <Icon
              name={currentStatus.name}
              color={currentStatus.color}
              style={styles.iconSmall}
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default ChatBubble
