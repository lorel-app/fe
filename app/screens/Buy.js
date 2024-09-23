import React, { useEffect } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

const BuyScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { user, media, title, price, caption, description, tags, dateTime } =
    route.params

  console.log('user:', user)

  useEffect(() => {
    navigation.setOptions({ title })
  }, [navigation, title])

  const styles = useGlobalStyles()

  return (
    <ScrollView vertical showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.row}>
        {user.displayPictureThumb ? (
          <Image
            source={{ uri: user.displayPictureThumb }}
            resizeMode="cover"
            style={styles.myProfilePic}
          />
        ) : (
          <Icon name="circle" size={100} style={styles.myProfilePic} />
        )}
        {user ? <Text style={styles.text}>{user.username}</Text> : null}
      </TouchableOpacity>

      <View style={styles.container}>
        {media.map((item, index) => (
          <Image
            key={index}
            source={{ uri: item.uri }}
            style={styles.image}
            resizeMode="contain"
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
  )
}

export default BuyScreen
