import React, { useContext, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme, useNavigation } from '@react-navigation/native'
import { useAlertModal } from '@/hooks/useAlertModal'
import AuthContext from '@/utils/authContext'
import api from '@/utils/api'

const formatDate = isoString => {
  const date = new Date(isoString)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'short' })
  return `${day} ${month}`
}
const Comment = ({ comment, isMyPost = false, onDelete }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const navigation = useNavigation()
  const showAlert = useAlertModal()
  const { user: me } = useContext(AuthContext)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleReportOrDelete = async () => {
    if (!me) {
      showAlert('error', 'Please log in first')
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

  const truncatedContent =
    comment.content.length > 120
      ? `${comment.content.substring(0, 120)}...`
      : comment.content

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
        <Text style={styles.textBold}>
          {isExpanded ? comment.content : truncatedContent}
        </Text>
        {comment.content.length > 120 && !isExpanded && (
          <TouchableOpacity
            style={[{ alignSelf: 'end' }, { marginRight: 5 }]}
            onPress={() => setIsExpanded(true)}
          >
            <Text style={[styles.textSmall, { color: colors.primary }]}>
              Read more
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.divider}></View>
    </View>
  )
}

export default Comment
