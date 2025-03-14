import Icon from 'react-native-vector-icons/MaterialIcons'
import React, { useState, useContext, useCallback } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme, useNavigation } from '@react-navigation/native'
import ButtonIcon from './ButtonIcon'
import ButtonFollow from './ButtonFollow'
import ButtonPostOptions from './ButtonPostOptions'
import api from '@/utils/api'
import { useAlertModal } from '@/hooks/useAlertModal'
import { SwiperFlatListWithGestureHandler } from 'react-native-swiper-flatlist/WithGestureHandler'
import { CustomPagination } from './Pagination'
import AuthContext from '@/utils/authContext'
import useFormatResponse from '@/hooks/useFormatResponse'

const Post = React.memo(({ post, hideCommentButton = false, onDeletePost }) => {
  const {
    id,
    user = {},
    commentCount,
    likeCount: initialLikeCount,
    liked: initialLikedStatus,
    caption,
    tags,
    createdAt,
    media,
    title,
    price,
    sold,
    type
  } = post

  const navigation = useNavigation()
  const { user: me } = useContext(AuthContext)
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const showAlert = useAlertModal()
  const { timeAgo } = useFormatResponse()

  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [liked, setLiked] = useState(initialLikedStatus)
  const [mediaIndex, setMediaIndex] = useState(0)

  const handleLike = useCallback(async () => {
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
  }, [liked, id])

  const mediaUrls = media.map(m => ({
    uri: m.url,
    type: m.type
  }))

  return (
    <>
      <View style={[styles.rowSpan, { zIndex: 999 }]}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            if (me && me.id === user.id) {
              navigation.navigate('Profile')
            } else {
              navigation.navigate('User', { user })
            }
          }}
        >
          <Image
            source={{ uri: user.displayPictureThumb }}
            resizeMode="cover"
            style={styles.profilePic}
          />
          <Text style={styles.text}>{user.username}</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <ButtonFollow user={user} />
          {me && (
            <ButtonPostOptions
              postId={post.id}
              post={post}
              postIndex={mediaIndex}
              userId={post.user.id}
              onDeletePost={onDeletePost}
            />
          )}
        </View>
      </View>

      <View style={styles.carouselContainer}>
        <SwiperFlatListWithGestureHandler
          data={mediaUrls}
          renderItem={({ item, index }) => (
            <View style={styles.slide}>
              <Image
                style={styles.image}
                source={{ uri: item.uri }}
                testID={`container_swiper_renderItem_screen_${index}`}
              />
            </View>
          )}
          showPagination={mediaUrls.length > 1}
          PaginationComponent={CustomPagination}
          onChangeIndex={({ index }) => setMediaIndex(index)}
          currentIndex={mediaIndex}
        />
      </View>

      {type === 'SHOP' ? (
        <TouchableOpacity
          style={[styles.rowSpan, { alignItems: 'start' }]}
          onPress={() => navigation.navigate('Buy', { post, user })}
        >
          <Text style={[styles.title, { textAlign: 'left' }]}>
            {title || 'Untitled'}
          </Text>
          <View style={styles.row}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text
                style={[
                  styles.textAccent,
                  sold && [
                    { textDecorationLine: 'line-through' },
                    { opacity: 0.5 }
                  ]
                ]}
              >
                {price ? price.split('.')[0] : '00'}
              </Text>
              <Text
                style={[
                  styles.textAccent,
                  { fontSize: 14 },
                  sold && { opacity: 0.5 }
                ]}
              >
                {price && price.split('.')[1]
                  ? `.${price.split('.')[1]}`
                  : '.00'}
              </Text>
            </View>
            <Icon
              name="keyboard-arrow-right"
              style={[styles.textAccent, { paddingTop: 3 }]}
            />
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={[styles.rowSpan, { padding: 10 }]}>
        <View style={styles.rowFlex}>
          <View style={[styles.rowWrap, { alignItems: 'end' }]}>
            {caption && (
              <Text style={[styles.text, { marginRight: 8 }]}>{caption}</Text>
            )}
            {createdAt && (
              <Text style={styles.textLight} numberOfLines={1}>
                {timeAgo(createdAt)}
              </Text>
            )}
          </View>

          <View style={[styles.rowWrap, { paddingTop: 8 }]}>
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
          {!hideCommentButton ? (
            <View style={{ alignItems: 'center' }}>
              <ButtonIcon
                iconName="chat-bubble-outline"
                iconSize={32}
                onPress={() => navigation.navigate('Comment', { post })}
                style={{ margin: 3 }}
              />
              <Text style={styles.textLight}>{commentCount}</Text>
            </View>
          ) : null}
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
})

export default Post
