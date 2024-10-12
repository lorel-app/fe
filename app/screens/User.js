import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SocialIcon from '@/assets/images/SocialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import HeaderStack from '../navigation/HeaderStack'
import { useAlertModal } from '@/hooks/useAlertModal'
import api from '@/utils/api'
import { useTheme } from '@react-navigation/native'
import Loader from '@/components/Loader'

const Tab = createMaterialTopTabNavigator()

const TabContent = ({ posts, fetchPosts, loading }) => {
  const styles = useGlobalStyles()

  const renderItems = ({ item }) => (
    <View style={styles.containerGrid}>
      <Image
        source={{ uri: item.media[0].url }}
        style={[styles.imageFit, { resizeMode: 'cover' }]}
      />
    </View>
  )

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
  const { colors } = useTheme()
  const { user = {}, showHeader = true } = route.params || {}
  const [userInfo, setUserInfo] = useState({})
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [shopPosts, setShopPosts] = useState([])
  const [contentPosts, setContentPosts] = useState([])
  const [hasMoreShopPosts, setHasMoreShopPosts] = useState(true)
  const [hasMoreContentPosts, setHasMoreContentPosts] = useState(true)
  const [offsetShop, setOffsetShop] = useState(0)
  const [offsetContent, setOffsetContent] = useState(0)
  const showAlert = useAlertModal()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.getUser(user.id)
        if (response.success) {
          setUserInfo(response.data.user)
        } else {
          showAlert('error', `${response.data.message}: Please try again later`)
        }
      } catch (err) {
        console.log('Error fetching user data:', err.message)
      } finally {
        setLoadingUser(false)
      }
    }
    fetchUserData()
  }, [user.id])

  const handleFollowToggle = isFollowing => {
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      followersCount: prevUserInfo.followersCount + (isFollowing ? 1 : -1)
    }))
  }

  const shopPostsFetched = useRef(false)

  const fetchPosts = async type => {
    if (
      loadingUser ||
      (type === 'shop' ? !hasMoreShopPosts : !hasMoreContentPosts) ||
      (type === 'shop' && shopPostsFetched.current)
    )
      return

    setLoadingPosts(true)
    if (type === 'shop') shopPostsFetched.current = true

    try {
      const response = await (type === 'shop'
        ? api.userPosts(userInfo.id, { offset: offsetShop, postType: 'SHOP' })
        : api.userPosts(userInfo.id, {
            offset: offsetContent,
            postType: 'CONTENT'
          }))

      if (response.success) {
        if (type === 'shop') {
          setShopPosts(prevPosts => [...prevPosts, ...response.data.posts])
          setHasMoreShopPosts(response.data.posts.length > 0)
          setOffsetShop(prevOffset => prevOffset + response.data.posts.length)
        } else {
          setContentPosts(prevPosts => [...prevPosts, ...response.data.posts])
          setHasMoreContentPosts(response.data.posts.length > 0)
          setOffsetContent(
            prevOffset => prevOffset + response.data.posts.length
          )
        }
      } else {
        showAlert(
          'error',
          `${response.data.message}: Please check your internet connection or try again later`
        )
      }
    } catch (error) {
      console.error(`Failed to fetch ${type} posts`, error.data.message)
    } finally {
      setLoadingPosts(false)
    }
  }

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
          <View>
            <Image
              source={{ uri: userInfo.displayPicture }}
              style={styles.coverPic}
            />
            <Image
              source={{ uri: userInfo.displayPicture }}
              style={styles.profilePicLarge}
            />
          </View>
          <View
            style={[
              styles.rowSpan,
              { maxWidth: 600 },
              { paddingHorizontal: 25 }
            ]}
          >
            <TouchableOpacity style={styles.profileButtons}>
              <Text style={styles.textBold}>Following</Text>
              <Text style={styles.textBold}>{userInfo.followingCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButtons}>
              <Text style={styles.textBold}>Followers</Text>
              <Text style={styles.textBold}>{userInfo.followersCount}</Text>
            </TouchableOpacity>
            <View style={styles.profileButtons}>
              <Text style={styles.textBold}>Likes</Text>
              <Text style={styles.textBold}>{userInfo.totalLikes}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <SocialIcon icon="facebook" />
            <SocialIcon icon="x" />
            <SocialIcon icon="instagram" />
            <SocialIcon icon="linkedIn" />
            <SocialIcon icon="behance" />
            <SocialIcon icon="tikTok" />
            <SocialIcon icon="pinterest" />
            <SocialIcon icon="youtube" />
            <SocialIcon icon="reddit" />
            <SocialIcon icon="twitch" />
          </View>
        </View>
        {/* nested scroll needs to be tested with more posts and on native */}
        <View style={styles.heightIsWidth}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color }) => {
                const icons = {
                  Shop: 'local-mall',
                  Content: 'interests'
                }
                return (
                  <MaterialIcons
                    name={icons[route.name]}
                    size={20}
                    color={color}
                  />
                )
              },
              tabBarActiveTintColor: colors.secondary,
              tabBarInactiveTintColor: colors.tint,
              tabBarShowLabel: false,
              tabBarStyle: {
                backgroundColor: colors.card
              },
              headerShown: false
            })}
          >
            <Tab.Screen name="Shop">
              {() => (
                <TabContent
                  posts={shopPosts}
                  fetchPosts={() => fetchPosts('shop')}
                  loading={loadingPosts}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="Content">
              {() => (
                <TabContent
                  posts={contentPosts}
                  fetchPosts={() => fetchPosts('content')}
                  loading={loadingPosts}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      </ScrollView>
    </>
  )
}

export default UserScreen
