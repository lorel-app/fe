import React, { useState, useContext } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import { PostShop, PostContent } from '@/components/PostTypes'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useFocusEffect } from '@react-navigation/native'
import AuthContext from '@/utils/authContext'
import api from '@/utils/api'

const HomeScreen = () => {
  const { loading: authLoading } = useContext(AuthContext)
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const showAlert = useAlertModal()

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
        showAlert(
          'error',
          `${response.data.message}: Please check your internet connection or try again later`
        )
      }
    } catch (error) {
      console.error('Failed to fetch posts', error.message)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      if (!authLoading) {
        setPosts([]), fetchPosts()
      }
    }, [authLoading])
  )

  const renderItem = ({ item: post }) => {
    const mediaUrls = post.media.map(m => ({
      uri: m.url,
      type: m.type
    }))

    return (
      <View
        style={[
          styles.post,
          post.type === 'SHOP'
            ? // temp until I decide what to do
              { borderTopColor: colors.card, borderTopWidth: 2 }
            : { borderTopColor: colors.card, borderTopWidth: 2 }
        ]}
        key={post.id}
      >
        {post.type === 'SHOP' ? (
          <PostShop
            id={post.id}
            user={post.user}
            media={mediaUrls}
            likeCount={post.likeCount}
            liked={post.liked}
            title={post.title}
            price={post.price}
            caption={post.caption}
            description={post.description}
            tags={post.tags}
            dateTime={post.createdAt}
          />
        ) : post.type === 'CONTENT' ? (
          <PostContent
            id={post.id}
            user={post.user}
            media={mediaUrls}
            likeCount={post.likeCount}
            liked={post.liked}
            caption={post.caption}
            tags={post.tags}
            dateTime={post.createdAt}
          />
        ) : null}
      </View>
    )
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
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      onEndReached={fetchPosts}
      onEndReachedThreshold={0.5} // Trigger when scrolled 50% from the end
      ListFooterComponent={renderFooter} // Show loader at the bottom
    />
  )
}

export default HomeScreen
