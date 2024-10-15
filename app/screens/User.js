import React, { useEffect, useState, useRef } from 'react'
import { View, FlatList, Image, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'
import api from '@/utils/api'
import HeaderStack from '../navigation/HeaderStack'
import Loader from '@/components/Loader'
import ProfileHeader from '@/components/ProfileHeader'
import NestedTabNavigator from '@/app/navigation/NestedTab'

const useFetchPosts = (userId, postType) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const postsFetched = useRef(false)

  const fetchPosts = async () => {
    if (!hasMore || postsFetched.current) return
    setLoading(true)
    postsFetched.current = true

    try {
      const response = await api.userPosts(userId, {
        offset,
        postType
      })

      if (response.success) {
        setPosts(prevPosts => [...prevPosts, ...response.data.posts])
        setHasMore(response.data.posts.length > 0)
        setOffset(prevOffset => prevOffset + response.data.posts.length)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error(`Failed to fetch ${postType} posts`, error.message)
    } finally {
      setLoading(false)
    }
  }

  return { posts, loading, fetchPosts, hasMore }
}

const TabContent = ({ posts, fetchPosts, loading, user }) => {
  const styles = useGlobalStyles()
  const navigation = useNavigation()

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const renderItems = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.containerGrid}
        onPress={() =>
          navigation.navigate('Comment', { post: { ...item, user } })
        }
      >
        <Image
          source={{ uri: item.media[0].url }}
          style={[styles.imageFit, { resizeMode: 'cover' }]}
        />
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItems}
      keyExtractor={item => item.id.toString()}
      showsVerticalScrollIndicator={false}
      numColumns={3}
      bounces={false}
      onEndReached={fetchPosts}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading && <Loader />}
      nestedScrollEnabled={true}
    />
  )
}

const UserScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { user = {}, showHeader = true } = route.params || {}
  const [userInfo, setUserInfo] = useState({})
  const showAlert = useAlertModal()

  const {
    posts: shopPosts,
    fetchPosts: fetchShopPosts,
    loading: loadingShop
  } = useFetchPosts(user.id, 'SHOP')
  const {
    posts: contentPosts,
    fetchPosts: fetchContentPosts,
    loading: loadingContent
  } = useFetchPosts(user.id, 'CONTENT')

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.getUser(user.id)
        if (response.success) {
          setUserInfo(response.data.user)
        } else {
          showAlert('error', `${response.data.message}: Please try again later`)
        }
      } catch (err) {
        console.log('Error fetching user data:', err.message)
      }
    }
    fetchUserInfo()
  }, [user.id])

  const handleFollowToggle = isFollowing => {
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      followersCount: prevUserInfo.followersCount + (isFollowing ? 1 : -1)
    }))
  }

  const screens = [
    {
      name: 'Shop',
      component: () => (
        <TabContent
          posts={shopPosts}
          fetchPosts={fetchShopPosts}
          loading={loadingShop}
          user={user}
        />
      )
    },
    {
      name: 'Content',
      component: () => (
        <TabContent
          posts={contentPosts}
          fetchPosts={fetchContentPosts}
          loading={loadingContent}
          user={user}
        />
      )
    }
  ]

  return (
    <>
      {showHeader && (
        <HeaderStack
          title={user.username}
          user={user}
          onFollowToggle={handleFollowToggle}
        />
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <ProfileHeader user={userInfo} />
        </View>
        <View style={{ flex: 1 }}>
          <NestedTabNavigator screens={screens} />
        </View>
      </ScrollView>
    </>
  )
}

export default UserScreen
