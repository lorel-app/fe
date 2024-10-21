import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme, useNavigation } from '@react-navigation/native'
import AuthContext from '@/utils/authContext'
import api from '@/utils/api'

const formatDate = isoString => {
  const date = new Date(isoString)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'short' })
  return `${day} ${month}`
}

const truncateText = content => {
  return content.length > 20 ? `${content.substring(0, 120)}...` : content
}

const Comment = ({ comment, isMyPost = false, onDelete }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { user: me } = useContext(AuthContext)

  const handleReportOrDelete = async () => {
    if (!me) {
      console.log('log in')
      return
    }
    if (isMyPost || comment.user.id === me.id) {
      const response = await api.deleteComment(comment.id)
      if (response.success) {
        console.log('post deleted')
        onDelete(comment.id)
      } else {
        console.log(response)
      }
    } else {
      console.log('Report comment')
    }
  }

  return (
    <View style={[styles.containerLeft, { maxWidth: 500 }]}>
      <View style={styles.rowSpan}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            if (me && me.id === comment.user.id) {
              navigation.navigate('Profile')
            } else {
              navigation.navigate('User', { user: comment.user })
            }
          }}
        >
          <Image
            source={{ uri: comment.user.displayPictureThumb }}
            resizeMode="cover"
            style={styles.profilePic}
          />
          <Text style={styles.text}>{comment.user.username}</Text>
          <Text style={[styles.textLight, { paddingLeft: 10 }]}>
            {formatDate(comment.createdAt)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReportOrDelete}>
          <Text
            style={[
              styles.textSmall,
              { marginHorizontal: 20 },
              {
                color:
                  isMyPost || (me && me.id === comment.user.id)
                    ? colors.accent
                    : colors.primary
              }
            ]}
          >
            {isMyPost || (me && me.id === comment.user.id)
              ? 'Delete'
              : 'Report'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: 20 }}>
        <Text style={styles.textBold}>{truncateText(comment.content)}</Text>
      </View>
      <View style={styles.divider}></View>
    </View>
  )
}

export default Comment
