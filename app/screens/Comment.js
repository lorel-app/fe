import React, { useRef, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import HeaderStack from '../navigation/HeaderStack'
import Post from '@/components/Post'
import SendInputBar from '@/components/SendInputBar'

const CommentScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { post = {}, user = {}, showHeader = true } = route.params || {}

  const scrollViewRef = useRef(null)

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [])

  const handleComment = myComment => {
    console.log('Sending:', myComment)
  }

  return (
    <>
      {showHeader && (
        <HeaderStack title={'comments'} user={user} hideFollowButton={true} />
      )}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.post}>
          <Post post={post} />
        </View>
      </ScrollView>
      <SendInputBar onSend={handleComment} placeholder="Add your comment..." />
    </>
  )
}

export default CommentScreen
