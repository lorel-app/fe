// tomorrow's work: https://dev.to/swarnaliroy94/nested-scrollviews-can-be-tricky-in-react-native-how-to-solve-4f5a
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import HeaderStack from '../navigation/HeaderStack'
import { useAlertModal } from '@/hooks/useAlertModal'
import api from '@/utils/api'
import { useTheme } from '@react-navigation/native'

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
      ListFooterComponent={loading && <ActivityIndicator size={'large'} />}
    />
  )
}

const UserScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const { user = {}, showHeader = true } = route.params || {}
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
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
        setLoading(false)
      }
    }
    fetchUserData()
  }, [user.id])

  const fetchPosts = async type => {
    if (loading || (type === 'shop' ? !hasMoreShopPosts : !hasMoreContentPosts))
      return

    setLoading(true)
    try {
      const response = await (type === 'shop'
        ? api.shopPosts(10, offsetShop)
        : api.contentPosts(10, offsetContent))

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
      console.error(`Failed to fetch ${type} posts`, error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {showHeader && <HeaderStack title={user.username} />}
      {userInfo && (
        <View style={styles.container}>
          <Image
            source={{ uri: userInfo.displayPicture }}
            style={styles.profilePicLarge}
          />
          <View style={[styles.rowSpan, { paddingHorizontal: 40 }]}>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <Text style={styles.textBold}>Followers</Text>
              <Text style={styles.textBold}>{userInfo.followersCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <Text style={styles.textBold}>Following</Text>
              <Text style={styles.textBold}>{userInfo.followingCount}</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.textBold}>Likes</Text>
              <Text style={styles.textBold}>{userInfo.totalLikes}</Text>
            </View>
          </View>
        </View>
      )}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            const icons = {
              Shop: 'local-mall',
              Content: 'interests'
            }
            return (
              <MaterialIcons name={icons[route.name]} size={20} color={color} />
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
              loading={loading}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Content">
          {() => (
            <TabContent
              posts={contentPosts}
              fetchPosts={() => fetchPosts('content')}
              loading={loading}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  )
}

export default UserScreen
