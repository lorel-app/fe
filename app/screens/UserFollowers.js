import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, Text } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import Loader from '@/components/Loader'
import HeaderStack from '@/app/navigation/HeaderStack'
import UserCard from '@/components/UserCard'
import api from '@/utils/api'

const UserFollowersScreen = ({ route }) => {
  const { userId, relationship, showHeader = true } = route.params || {}
  const styles = useGlobalStyles()

  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const limit = 12

  const fetchFollowers = useCallback(async () => {
    if (!hasMore || loading) return
    setLoading(true)

    const response = await api.getFollowers(userId, {
      relationship,
      offset,
      limit
    })

    if (response && response.data.users.length > 0) {
      setFollowers(prevFollowers => [...prevFollowers, ...response.data.users])
      setHasMore(response.data.users.length === limit)
      setOffset(prevOffset => prevOffset + response.data.users.length)
    } else {
      setHasMore(false)
    }
    setLoading(false)
  }, [userId, relationship, offset, limit, hasMore, loading])

  useEffect(() => {
    fetchFollowers()
  }, [fetchFollowers])

  const handleEndReached = () => {
    if (!loading && hasMore) {
      fetchFollowers()
    }
  }

  const renderItem = useCallback(({ item: follower }) => {
    return <UserCard user={follower}></UserCard>
  }, [])

  if (loading && offset === 0) {
    return <Loader />
  }

  return (
    <>
      {showHeader && (
        <HeaderStack title={`${relationship}`} hideFollowButton={true} />
      )}
      <FlatList
        data={followers}
        renderItem={renderItem}
        initialNumToRender={12}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <Loader />}
        ListEmptyComponent={<Text style={styles.textLight}>no one yet</Text>}
        scrollEventThrottle={100}
      />
    </>
  )
}

export default UserFollowersScreen
