import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useNavigation } from '@react-navigation/native'
import AuthContext from '@/utils/authContext'
import ButtonFollow from './ButtonFollow'
import useFormatResponse from '@/hooks/useFormatResponse'
import api from '@/utils/api'
import Loader from './Loader'

const UserCard = ({ user, children }) => {
  const styles = useGlobalStyles()
  const navigation = useNavigation()
  const { user: me } = useContext(AuthContext)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { truncate } = useFormatResponse()

  useEffect(() => {
    if (user.id) {
      const getUser = async () => {
        setLoading(true)
        try {
          const response = await api.getUser(user.id)
          setUserData(response.data.user)
        } catch (error) {
          console.error('Error fetching user:', error)
        } finally {
          setLoading(false)
        }
      }
      getUser()
    }
  }, [user.id])

  if (loading) {
    return <Loader />
  }

  const { id, username, displayPictureThumb, userFollows } = userData
  const resolvedUser = user.follower || userData

  return (
    <View
      style={[
        styles.card,
        styles.boxShadow,
        { maxWidth: 500 },
        { marginVertical: 5 },
        { padding: 0 }
      ]}
    >
      <View style={styles.rowSpan}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            if (me && me.id === id) {
              navigation.navigate('Profile')
            } else {
              navigation.navigate('User', { user: resolvedUser })
            }
          }}
        >
          <Image
            source={{ uri: displayPictureThumb }}
            resizeMode="cover"
            style={styles.profilePic}
          />
          <Text style={styles.text}>{truncate(username)}</Text>
        </TouchableOpacity>
        <ButtonFollow user={resolvedUser} />
      </View>
      {children && (
        <View style={[styles.rowSpan, { padding: 15 }, { paddingTop: 0 }]}>
          {children}
        </View>
      )}
    </View>
  )
}

export default UserCard
