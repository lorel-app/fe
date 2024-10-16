import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import Post from '@/components/Post'
import Loader from '@/components/Loader'
import HeaderStack from '@/app/navigation/HeaderStack'
import useFetchUserPosts from '@/hooks/useFetchUserPosts'

const UserPostsScreen = ({ route }) => {
  const { postsType, postId, user = {}, showHeader = true } = route.params || {}
  const styles = useGlobalStyles()

  const { posts, fetchPosts, loading } = useFetchUserPosts(user.id, postsType)
  const [initialIndex, setInitialIndex] = useState(null)
  const [isFetching, setIsFetching] = useState(true)

  const checkForPostId = useCallback(() => {
    if (posts.length > 0 && postId) {
      const index = posts.findIndex(post => post.id === postId)
      if (index !== -1) {
        setInitialIndex(index)
        setIsFetching(false)
      } else {
        fetchPosts()
      }
    } else {
      fetchPosts()
    }
  }, [posts, postId, fetchPosts])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    checkForPostId()
  }, [posts, checkForPostId])

  const renderItem = ({ item: post }) => {
    return (
      <View style={styles.post} key={post.id}>
        <Post post={{ ...post, user }} />
      </View>
    )
  }

  return (
    <>
      {showHeader && (
        <HeaderStack
          title={`${user.username}'s ${postsType.toLowerCase()}`}
          user={user}
          hideFollowButton={true}
        />
      )}
      {isFetching || loading ? (
        <Loader />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          onEndReached={fetchPosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <Loader />}
          initialScrollIndex={initialIndex}
        />
      )}
    </>
  )
}

export default UserPostsScreen
