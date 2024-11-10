import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useNavigation } from '@react-navigation/native'
import AuthContext from '@/utils/authContext'
import ButtonFollow from './ButtonFollow'

const UserCard = ({ user, children }) => {
  const styles = useGlobalStyles()
  const navigation = useNavigation()
  const { user: me } = useContext(AuthContext)

  const resolvedUser = user.follower || user
  const { id, username, displayPictureThumb, userFollows } = resolvedUser

  const truncatedUsername =
    username && username.length > 30
      ? `${username.substring(0, 30)}...`
      : username

  return (
    <View style={[styles.post, { maxWidth: 500 }]}>
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
          <Text style={styles.text}>{truncatedUsername}</Text>
        </TouchableOpacity>
        <ButtonFollow user={resolvedUser} />
      </View>
      {children && <View>{children}</View>}
    </View>
  )
}

export default UserCard
