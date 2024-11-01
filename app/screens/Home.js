import React, { useState, useContext } from 'react'
import { View, FlatList } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import Post from '@/components/Post'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useFocusEffect } from '@react-navigation/native'
import AuthContext from '@/utils/authContext'
import api from '@/utils/api'
import Loader from '@/components/Loader'

const HomeScreen = () => {
  const { loading: authLoading } = useContext(AuthContext)
  const styles = useGlobalStyles()
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
        setPosts([])
        fetchPosts()
      }
    }, [authLoading])
  )

  const handleDeletePost = async postId => {
    const response = await api.deletePost(postId)
    if (response.success) {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
    }
  }

  const renderItem = ({ item: post }) => {
    return (
      <View style={styles.post} key={post.id}>
        <Post post={post} onDeletePost={handleDeletePost} />
      </View>
    )
  }

  return (
    <FlatList
      testID={'scrollable-feed'}
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      onEndReached={fetchPosts}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading && <Loader />}
    />
  )
}

export default HomeScreen
