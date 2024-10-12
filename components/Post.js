import Icon from 'react-native-vector-icons/MaterialIcons'
import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme, useNavigation } from '@react-navigation/native'
import ButtonIcon from './ButtonIcon'
import ButtonFollow from './ButtonFollow'
import api from '@/utils/api'
import { useAlertModal } from '@/hooks/useAlertModal'
import { SwiperFlatListWithGestureHandler } from 'react-native-swiper-flatlist/WithGestureHandler'
import { CustomPagination } from './Pagination'
import AuthContext from '@/utils/authContext'

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
  media,
  title,
  price,
  description,
  type
}) => {
  const navigation = useNavigation()
  const { user: me } = useContext(AuthContext)
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
          showAlert('error', 'Please log in first')
        }
      } else {
        response = await api.unlikePost(id)
        if (response.success) {
          setLikeCount(prevLikeCount => prevLikeCount - 1)
          setLiked(false)
        } else {
          showAlert('error', 'Please log in first')
        }
      }
    } catch (error) {
      console.log('Failed to like/unlike post:', error.message)
    }
  }

  const navigateToBuyScreen = post => {
    navigation.navigate('Buy', {
      user: post.user,
      media: post.media,
      title: post.title,
      price: post.price,
      caption: post.caption,
      description: post.description,
      tags: post.tags,
      dateTime: post.createdAt
    })
  }

  return (
    <>
      <View style={styles.rowSpan}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            if (me && me.id === user.id) {
              navigation.navigate('Profile')
            } else {
              navigation.navigate('User', { user, showHeader: true })
            }
          }}
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

      <View style={styles.carouselContainer}>
        <SwiperFlatListWithGestureHandler
          data={media}
          renderItem={({ item, index }) => (
            <View style={styles.slide}>
              <Image
                style={styles.image}
                source={{ uri: item.uri }}
                testID={`container_swiper_renderItem_screen_${index}`}
              />
            </View>
          )}
          showPagination={media.length > 1}
          PaginationComponent={CustomPagination}
        />
      </View>

      {type === 'SHOP' ? (
        <TouchableOpacity
          style={styles.rowSpan}
          onPress={() =>
            navigateToBuyScreen({
              user,
              media,
              title,
              price,
              caption,
              description,
              tags,
              dateTime
            })
          }
        >
          {title ? (
            <Text style={[styles.title, { textAlign: 'left' }]}>{title}</Text>
          ) : (
            <Text style={[styles.title, { textAlign: 'left' }]}>Untitled</Text>
          )}
          <View style={styles.row}>
            {price ? (
              <Text style={styles.textAccent}>EUR {price}</Text>
            ) : (
              <Text>0</Text>
            )}
            <Icon
              name="keyboard-arrow-right"
              style={[styles.textAccent, { paddingTop: 3 }]}
            />
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={[styles.rowSpan, { padding: 10 }]}>
        <View style={styles.rowFlex}>
          {caption && (
            <Text style={[styles.text, { paddingBottom: 10 }]}>
              {caption}
              {dateTime && (
                <Text style={styles.textLight}> ({formatDate(dateTime)})</Text>
              )}
            </Text>
          )}

          <View style={styles.rowWrap}>
            {tags?.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.buttonSmall}>
                <Text
                  style={{
                    color:
                      tag.type === 'SUBJECT'
                        ? colors.tertiary
                        : tag.type === 'MEDIUM'
                          ? colors.primary
                          : colors.secondary
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
              onPress={handleLike}
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
