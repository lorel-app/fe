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
      let response
      if (!isFollowing) {
        response = await followUser(user.id)
      } else {
        response = await unfollowUser(user.id)
      }
      if (!response.success) {
        showAlert('error', 'Please log in first')
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
