import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useFollowingContext } from '@/hooks/useFollowingContext'

const ButtonFollow = ({ user }) => {
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const { userFollows, followUser, unfollowUser } = useFollowingContext()

  const isFollowing = userFollows[user.id] ?? user.userFollows

  const handleFollow = async () => {
    try {
      if (!isFollowing) {
        await followUser(user.id)
      } else {
        await unfollowUser(user.id)
      }
    } catch (error) {
      showAlert('Whoops', error.message)
    }
  }

  return (
    <TouchableOpacity
      style={[
        isFollowing ? styles.buttonSmallSelected : styles.buttonSmall,
        { width: 70 }
      ]}
      onPress={handleFollow}
    >
      <Text style={styles.textCenter}>
        {isFollowing ? 'unfollow' : 'follow'}
      </Text>
    </TouchableOpacity>
  )
}

export default ButtonFollow
