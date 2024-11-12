import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList, Image, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  useNavigation,
  useFocusEffect,
  useTheme
} from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'
import api from '@/utils/api'
import HeaderStack from '../navigation/HeaderStack'
import Loader from '@/components/Loader'
import ProfileHeader from '@/components/ProfileHeader'
import NestedTabNavigator from '@/app/navigation/NestedTab'
import useFetchUserPosts from '@/hooks/useFetchUserPosts'
import ButtonIcon from '@/components/ButtonIcon'

const TabContent = ({ posts, fetchPosts, loading, user }) => {
  const styles = useGlobalStyles()
  const navigation = useNavigation()

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const renderItems = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.containerGrid}
        onPress={() =>
          navigation.navigate('UserPosts', {
            postsType: item.type,
            postId: item.id,
            user
          })
        }
      >
        <Image
          source={{ uri: item.media[0].url }}
          style={[styles.imageFit, { resizeMode: 'cover' }]}
        />
      </TouchableOpacity>
    ),
    [navigation, user, styles.containerGrid, styles.imageFit]
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
      // to be completed - only show if not loading
      // ListEmptyComponent={
      //   <Text style={styles.textBold}>Nothing posted yet</Text>
      // }
      nestedScrollEnabled={true}
    />
  )
}

const UserScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const { user = {}, showHeader = true } = route.params || {}
  const [userInfo, setUserInfo] = useState({})
  const showAlert = useAlertModal()
  const navigation = useNavigation()

  const {
    posts: shopPosts,
    fetchPosts: fetchShopPosts,
    loading: loadingShop
  } = useFetchUserPosts(user.id, 'SHOP')
  const {
    posts: contentPosts,
    fetchPosts: fetchContentPosts,
    loading: loadingContent
  } = useFetchUserPosts(user.id, 'CONTENT')

  useFocusEffect(
    useCallback(() => {
      const fetchUserInfo = async () => {
        const response = await api.getUser(user.id)
        if (response.success) {
          setUserInfo(response.data.user)
        } else {
          showAlert('error', `${response.data.message}: Please try again later`)
        }
      }
      fetchUserInfo()
    }, [user.id, showAlert])
  )

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
        <>
          <HeaderStack
            title={user.username}
            user={user}
            onFollowToggle={handleFollowToggle}
          />
          <View style={styles.messageButton}>
            <ButtonIcon
              iconName="mode-comment"
              iconColor={colors.textAlt}
              onPress={() => {
                navigation.navigate('Message', { userId: user.id })
              }}
            />
          </View>
        </>
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
