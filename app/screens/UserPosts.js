import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useNavigation } from '@react-navigation/native'
import Post from '@/components/Post'
import Loader from '@/components/Loader'
import HeaderStack from '@/app/navigation/HeaderStack'
import useFetchUserPosts from '@/hooks/useFetchUserPosts'
import api from '@/utils/api'

const UserPostsScreen = ({ route }) => {
  const { postsType, postId, user = {}, showHeader = true } = route.params || {}
  const styles = useGlobalStyles()
  const navigation = useNavigation()

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

  const handleDeletePost = async postId => {
    await api.deletePost(postId)
    navigation.goBack()
    navigation.reset({
      index: 0,
      routes: [{ name: 'Profile' }]
    })
  }

  const renderItem = useCallback(
    ({ item: post }) => {
      return (
        <View style={styles.post} key={post.id}>
          <Post post={{ ...post, user }} onDeletePost={handleDeletePost} />
        </View>
      )
    },
    [user]
  )

  if (loading || initialIndex === null) {
    return <Loader />
  }

  return (
    <>
      {showHeader && (
        <HeaderStack
          title={`${user.username}'s ${postsType.toLowerCase()}`}
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
