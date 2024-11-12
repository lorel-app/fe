import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useNavigation } from '@react-navigation/native'
import AuthContext from '@/utils/authContext'
import ButtonFollow from './ButtonFollow'
import useFormatResponse from '@/hooks/useFormatResponse'

const UserCard = ({ user, children }) => {
  const styles = useGlobalStyles()
  const navigation = useNavigation()
  const { user: me } = useContext(AuthContext)

  const resolvedUser = user.follower || user
  const { id, username, displayPictureThumb, userFollows } = resolvedUser
  const { truncate } = useFormatResponse()

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
