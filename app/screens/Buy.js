import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import HeaderStack from '../navigation/HeaderStack'

const BuyScreen = () => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const route = useRoute()
  const navigation = useNavigation()
  const { user, media, title, price, caption, description, tags, dateTime } =
    route.params

  return (
    <>
      <HeaderStack title={title} user={user} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.containerStack}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('User', { user, showHeader: true })
          }
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
        <View style={[styles.container, { flex: 1 }]}>
          {media.map((item, index) => (
            <View key={index} style={{ minHeight: 0 }}>
              <Image source={{ uri: item.uri }} style={styles.image} />
            </View>
          ))}

          <Text style={styles.text}>Price: {price}</Text>
          <Text style={styles.text}>Posted by: {user.username}</Text>
          <Text style={styles.text}>{caption}</Text>
          <Text style={styles.text}>{description}</Text>
          <Text style={styles.text}>Tags: {tags.join(', ')}</Text>
          <Text style={styles.text}>{dateTime}</Text>
          <View style={styles.rowWrap}>
            {tags?.map((tag, index) => (
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
