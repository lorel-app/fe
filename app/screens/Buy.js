import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import HeaderStack from '../navigation/HeaderStack'

const formatDate = isoString => {
  const date = new Date(isoString)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const BuyScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { post = {}, user = {}, showHeader = true } = route.params || {}

  return (
    <>
      {showHeader && <HeaderStack title={post.title} user={user} />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('User', { user })}
          style={styles.rowEnd}
        >
          {user ? <Text style={styles.text}>{user.username}</Text> : null}
          {user.displayPictureThumb ? (
            <Image
              source={{ uri: user.displayPictureThumb }}
              resizeMode="cover"
              style={styles.profilePic}
            />
          ) : (
            <Icon name="circle" size={100} style={styles.profilePicLarge} />
          )}
        </TouchableOpacity>
        <View style={styles.container}>
          {post.media.map((item, index) => (
            <View key={index} style={{ minHeight: 0 }}>
              <Image source={{ uri: item.url }} style={styles.image} />
            </View>
          ))}

          <Text style={styles.text}>Price: {post.price}</Text>
          <Text style={styles.text}>Posted by: {user.username}</Text>
          <Text style={styles.text}>{post.caption}</Text>
          <Text style={styles.text}>{post.description}</Text>
          <Text style={styles.text}>{formatDate(post.createdAt)}</Text>
          <View style={styles.rowWrap}>
            {post.tags?.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.buttonSmall}>
                <Text
                  style={{
                    color:
                      tag.type === 'SUBJECT'
                        ? colors.tertiary
                        : tag.type === 'MEDIUM'
                          ? colors.primary
                          : colors.secondary
                  }}
                >
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  )
}

export default BuyScreen
