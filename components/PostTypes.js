import React from 'react'
import Post from './Post'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { SwiperFlatListWithGestureHandler } from 'react-native-swiper-flatlist/WithGestureHandler'
import { CustomPagination } from './Pagination'
import { useNavigation } from '@react-navigation/native'

const PostShop = ({
  user,
  media,
  title,
  price,
  caption,
  description,
  tags,
  dateTime
}) => {
  const styles = useGlobalStyles()
  const showPagination = media.length > 1
  const navigation = useNavigation()

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
    <Post
      user={user}
      title={title}
      price={price}
      caption={caption}
      description={description}
      tags={tags}
      dateTime={dateTime}
    >
      <View style={styles.carouselContainer}>
        <SwiperFlatListWithGestureHandler
          data={media}
          renderItem={({ item, index }) => (
            <View style={styles.slide}>
              <Image
                style={[styles.image, styles.boxShadow]}
                source={{ uri: item.uri }}
                //testID={`container_swiper_renderItem_screen_${index}`}
                // onPress={{}}
              ></Image>
            </View>
          )}
          showPagination={showPagination}
          PaginationComponent={CustomPagination}
        />
      </View>
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
          <Text style={styles.title}>{title}</Text>
        ) : (
          <Text>Untitled</Text>
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
    </Post>
  )
}

const PostContent = ({ user, media, caption, tags, dateTime }) => {
  const styles = useGlobalStyles()
  const showPagination = media.length > 1

  return (
    <Post user={user} caption={caption} tags={tags} dateTime={dateTime}>
      <View style={styles.carouselContainer}>
        <SwiperFlatListWithGestureHandler
          data={media}
          renderItem={({ item, index }) => (
            <View style={styles.slide}>
              <Image
                style={styles.image}
                source={{ uri: item.uri }}
                // testID={`container_swiper_renderItem_screen_${index}`}
              ></Image>
            </View>
          )}
          showPagination={showPagination}
          PaginationComponent={CustomPagination}
        />
      </View>
    </Post>
  )
}

export { PostShop, PostContent }
