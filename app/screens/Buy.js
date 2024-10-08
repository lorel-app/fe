import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useRoute } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import HeaderStack from '../navigation/HeaderStack'

const BuyScreen = () => {
  const styles = useGlobalStyles()
  const route = useRoute()
  const { user, media, title, price, caption, description, tags, dateTime } =
    route.params

  return (
    <>
      <HeaderStack title={title} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.containerStack}
      >
        <TouchableOpacity style={styles.row}>
          {user.displayPictureThumb ? (
            <Image
              source={{ uri: user.displayPictureThumb }}
              resizeMode="cover"
              style={styles.profilePicLarge}
            />
          ) : (
            <Icon name="circle" size={100} style={styles.profilePicLarge} />
          )}
          {user ? <Text style={styles.text}>{user.username}</Text> : null}
        </TouchableOpacity>
        <View style={styles.slide}>
          {media.map((item, index) => (
            <Image
              key={index}
              source={{ uri: item.uri }}
              style={styles.image}
            />
          ))}

          <Text style={styles.text}>Price: {price}</Text>
          <Text style={styles.text}>Posted by: {user.username}</Text>
          <Text style={styles.text}>{caption}</Text>
          <Text style={styles.text}>{description}</Text>
          <Text style={styles.text}>Tags: {tags.join(', ')}</Text>
          <Text style={styles.text}>{dateTime}</Text>
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
