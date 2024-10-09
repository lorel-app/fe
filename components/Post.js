import Icon from 'react-native-vector-icons/MaterialIcons'
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme, useNavigation } from '@react-navigation/native'
import ButtonIcon from './ButtonIcon'
import ButtonFollow from './ButtonFollow'
import api from '@/utils/api'
import { useAlertModal } from '@/hooks/useAlertModal'

const formatDate = isoString => {
  const date = new Date(isoString)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'short' })
  return `${day} ${month}`
}

const Post = ({
  id,
  user,
  likeCount: initialLikeCount,
  liked: initialLikedStatus,
  caption,
  tags,
  dateTime,
  children
}) => {
  const navigation = useNavigation()

  const navigateToUserScreen = user => {
    navigation.navigate('User', {
      user: user,
      showHeader: true
    })
  }

  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const showAlert = useAlertModal()

  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [liked, setLiked] = useState(initialLikedStatus)
  const handleLike = async () => {
    try {
      let response
      if (!liked) {
        response = await api.likePost(id)
        if (response.success) {
          setLikeCount(prevLikeCount => prevLikeCount + 1)
          setLiked(true)
        } else {
          showAlert('error', 'Please log in first.')
        }
      } else {
        response = await api.unlikePost(id)
        if (response.success) {
          setLikeCount(prevLikeCount => prevLikeCount - 1)
          setLiked(false)
        } else {
          showAlert('error', 'Please log in first.')
        }
      }
    } catch (error) {
      console.log('Failed to like/unlike post:', error.message)
    }
  }

  return (
    <>
      <View style={styles.rowSpan}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigateToUserScreen(user)}
        >
          {user.displayPictureThumb ? (
            <Image
              source={{ uri: user.displayPictureThumb }}
              resizeMode="cover"
              style={styles.profilePic}
            />
          ) : (
            <Icon name="circle" size={24} style={styles.profilePic} />
          )}
          <Text style={styles.text}>{user.username}</Text>
        </TouchableOpacity>
        <ButtonFollow user={user} />
      </View>

      {children}

      <View style={[styles.rowSpan, { padding: 10 }]}>
        <View style={styles.rowFlex}>
          {caption ? (
            <Text style={[styles.text, { paddingBottom: 10 }]}>
              {caption}
              {dateTime ? (
                <Text style={styles.textLight}> ({formatDate(dateTime)})</Text>
              ) : null}
            </Text>
          ) : null}

          <View style={styles.rowWrap}>
            {tags?.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.buttonSmall}>
                <Text
                  style={{
                    color: (() => {
                      switch (tag.type) {
                        case 'SUBJECT':
                          return colors.tertiary
                        case 'MEDIUM':
                          return colors.primary
                        case 'STYLE':
                          return colors.secondary
                        default:
                          return colors.text
                      }
                    })()
                  }}
                >
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.rowEnd}>
          <View style={{ alignItems: 'center' }}>
            <ButtonIcon
              iconName="chat-bubble-outline"
              iconSize={32}
              onPress={() => console.log('Icon pressed')}
              style={{ margin: 3 }}
            />
            <Text style={styles.textLight}>999</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <ButtonIcon
              iconName={liked ? 'favorite' : 'favorite-outline'}
              iconColor={liked ? colors.tertiary : colors.secondaryTint}
              iconSize={32}
              onPress={() => handleLike()}
              style={{ margin: 3 }}
            />
            <Text style={styles.textLight}>{likeCount}</Text>
          </View>
        </View>
      </View>
    </>
  )
}

export default Post
