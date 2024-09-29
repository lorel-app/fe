import React, { useEffect, useState } from 'react'
import { View, Dimensions, FlatList, ActivityIndicator } from 'react-native'
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
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const response = await api.allPosts(10, offset)
      if (response.success) {
        setPosts(prevPosts => [...prevPosts, ...response.data.posts])
        setHasMore(response.data.posts.length > 0)
        setOffset(prevOffset => prevOffset + response.data.posts.length)
      } else {
        console.error(response.error)
      }
    } catch (error) {
      console.error('Failed to fetch posts', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()

    const handleResize = () => {
      setIsWideScreen(Dimensions.get('window').width > 700)
    }

    Dimensions.addEventListener('change', handleResize)
    return () => {
      Dimensions.removeEventListener('change', handleResize)
    }
  }, []) // Empty dependency array to run only once on mount

  const renderItem = ({ item: post }) => {
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
            { borderTopColor: colors.card, borderTopWidth: 2 }
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
  }

  const renderFooter = () => {
    if (!loading) return null
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={
        isWideScreen ? styles.containerGrid : styles.container
      }
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      onEndReached={fetchPosts}
      onEndReachedThreshold={0.5} // Trigger when scrolled 50% from the end
      // have no idea what this looks like hehe:
      ListFooterComponent={renderFooter} // Show loader at the bottom
    />
  )
}

export default HomeScreen
