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

  const checkForPostId = useCallback(() => {
    if (postId && posts.length > 0) {
      const index = posts.findIndex(post => post.id === postId)
      if (index !== -1) {
        setInitialIndex(index)
      }
    }
  }, [posts, postId])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    checkForPostId()
  }, [posts, checkForPostId])

  if (loading || initialIndex === null) {
    return <Loader />
  }

  const renderItem = ({ item: post }) => (
    <View style={styles.post} key={post.id}>
      <Post post={{ ...post, user }} />
    </View>
  )

  return (
    <>
      {showHeader && (
        <HeaderStack
          title={`${user.username}'s ${postsType.toLowerCase()}`}
          user={user}
          hideFollowButton={true}
        />
      )}
      <FlatList
        data={posts}
        renderItem={renderItem}
        initialNumToRender={6}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={fetchPosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <Loader />}
        initialScrollIndex={initialIndex}
        scrollEventThrottle={100}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index
        })}
      />
    </>
  )
}

export default UserPostsScreen
