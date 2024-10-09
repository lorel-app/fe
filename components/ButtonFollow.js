import React, { useState, useContext, useEffect } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import AuthContext from '@/utils/authContext'
import api from '@/utils/api'
import { useAlertModal } from '@/hooks/useAlertModal'

const ButtonFollow = ({ user }) => {
  const styles = useGlobalStyles()
  const showAlert = useAlertModal()
  const { user: me } = useContext(AuthContext)

  if (me && me.id === user.id) {
    return null
  }

  const [isFollowing, setIsFollowing] = useState(
    !user ? false : user.userFollows
  )
  // useEffect(() => {
  //   setIsFollowing(user?.userFollows ?? false)
  // }, [user])

  const handleFollow = async () => {
    try {
      let response
      if (!isFollowing) {
        response = await api.followUser(user.id)
        if (response.success) {
          setIsFollowing(true)
        } else {
          showAlert('error', 'Please log in first.')
        }
      } else {
        response = await api.unfollowUser(user.id)
        if (response.success) {
          setIsFollowing(false)
        } else {
          showAlert('error', 'Please log in first.')
        }
      }
    } catch (error) {
      showAlert('Whoops, ', error.message)
    }
  }

  return (
    <TouchableOpacity
      style={[
        isFollowing ? styles.buttonSmallSelected : styles.buttonSmall,
        { width: 70 }
      ]}
      onPress={() => handleFollow()}
    >
      <Text style={styles.textCenter}>
        {isFollowing ? 'unfollow' : 'follow'}
      </Text>
    </TouchableOpacity>
  )
}

export default ButtonFollow
