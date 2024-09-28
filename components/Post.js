import Icon from 'react-native-vector-icons/MaterialIcons'
import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import ButtonIcon from './ButtonIcon'

const formatDate = isoString => {
  const date = new Date(isoString)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'short' })
  return `${day} ${month}`
}

const Post = ({ user, caption, tags, dateTime, children }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()

  return (
    <>
      <View style={styles.rowSpan}>
        <TouchableOpacity style={styles.row}>
          {user.displayPictureThumb ? (
            <Image
              source={{ uri: user.displayPictureThumb }}
              resizeMode="cover"
              style={styles.profilePic}
            />
          ) : (
            <Icon name="circle" size={24} style={styles.profilePic} />
          )}
          <Text style={styles.text}>{user.username}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.text}>Follow</Text>
        </TouchableOpacity>
      </View>

      {children}

      <View style={styles.rowSpan}>
        {caption ? (
          <Text style={styles.text}>
            {caption}
            {dateTime ? (
              <Text style={styles.textLight}> ({formatDate(dateTime)})</Text>
            ) : null}
          </Text>
        ) : null}
      </View>

      <View style={styles.rowSpan}>
        <View style={styles.rowFlex}>
          {tags?.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.buttonSmall}>
              <Text
                style={{
                  color: (() => {
                    switch (tag.type) {
                      case 'SUBJECT':
                        return colors.tertiary
                      case 'MEDIUM':
                        return colors.primary
                      case 'STYLE':
                        return colors.secondary
                      default:
                        return colors.text
                    }
                  })()
                }}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.rowFit}>
          <Text style={styles.textLight}>999</Text>
          <ButtonIcon
            iconName="chat-bubble-outline"
            onPress={() => console.log('Icon pressed')}
            style={{ margin: 1 }}
          />
          <ButtonIcon
            iconName="bookmark-outline"
            onPress={{}}
            style={{ margin: 1 }}
          />
          <ButtonIcon
            iconName="favorite-outline"
            onPress={{}}
            style={{ margin: 1 }}
          />
        </View>
      </View>
    </>
  )
}

export default Post
