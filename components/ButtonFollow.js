import React, { useContext } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useFollowingContext } from '@/hooks/useFollowingContext'
import AuthContext from '@/utils/authContext'

const ButtonFollow = ({ user, onFollowToggle }) => {
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const { userFollows, followUser, unfollowUser } = useFollowingContext()
  const { user: me } = useContext(AuthContext)

  if (me && me.id === user.id) {
    return null
  }

  const isFollowing = userFollows[user.id] ?? user.userFollows

  const handleFollow = async () => {
    if (isFollowing) {
      const response = await unfollowUser(user.id)
      if (response.success) {
        onFollowToggle && onFollowToggle(false)
        const updatedUser = response.data
      } else {
        showAlert('error', 'Please log in first')
      }
    } else {
      const response = await followUser(user.id)
      if (response.success) {
        onFollowToggle && onFollowToggle(true)
      } else {
        showAlert('error', 'Please log in first')
      }
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
