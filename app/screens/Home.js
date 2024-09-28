import React, { useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import { PostShop, PostContent } from '@/components/PostTypes'
import api from '@/utils/api'

const HomeScreen = () => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const [posts, setPosts] = useState([])
  const [isWideScreen, setIsWideScreen] = useState(
    Dimensions.get('window').width > 700
  )

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.allPosts()
        if (response.success) {
          setPosts(response.data.posts)
        } else {
          console.error(response.error)
        }
      } catch (error) {
        console.error('Failed to fetch posts', error)
      }
    }
    fetchPosts()

    const handleResize = () => {
      setIsWideScreen(Dimensions.get('window').width > 700)
    }

    Dimensions.addEventListener('change', handleResize)
    return () => {
      Dimensions.removeEventListener('change', handleResize)
    }
  }, [])

  return (
    <ScrollView vertical showsVerticalScrollIndicator={false}>
      <View style={isWideScreen ? styles.containerGrid : styles.container}>
        {posts.map((post, index) => {
          const mediaUrls = post.media.map(m => ({
            uri: m.url,
            type: m.type
          }))

          if (post.type === 'SHOP') {
            return (
              <View
                style={[
                  isWideScreen ? styles.gridPost : styles.post,
                  { backgroundColor: colors.card }
                ]}
                key={post.id}
              >
                <PostShop
                  user={post.user}
                  media={mediaUrls}
                  title={post.title}
                  price={post.price}
                  caption={post.caption}
                  description={post.description}
                  tags={post.tags}
                  dateTime={post.createdAt}
                />
              </View>
            )
          } else if (post.type === 'CONTENT') {
            return (
              <View
                style={[
                  isWideScreen ? styles.gridPost : styles.post,
                  { borderTopColor: colors.card },
                  { borderTopWidth: 2 }
                ]}
                key={post.id}
              >
                <PostContent
                  user={post.user}
                  media={mediaUrls}
                  caption={post.caption}
                  tags={post.tags}
                  dateTime={post.createdAt}
                />
              </View>
            )
          }
          return null
        })}
      </View>
    </ScrollView>
  )
}

export default HomeScreen
