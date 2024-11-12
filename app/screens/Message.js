import React, { useEffect, useRef, useState, useContext } from 'react'
import { useTheme, useFocusEffect } from '@react-navigation/native'
import { FlatList, Text, View } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useNavigation } from '@react-navigation/native'
import api from '@/utils/api'
import HeaderStack from '../navigation/HeaderStack'
import Post from '@/components/Post'
import SendInputBar from '@/components/SendInputBar'
import Loader from '@/components/Loader'
import AuthContext from '@/utils/authContext'
import ChatBubble from '@/components/ChatBubble'

const MessageScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const { userId, showHeader = true } = route.params || {}
  const { user: me } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const showAlert = useAlertModal()
  const navigation = useNavigation()

  //   const fetchMessages = async () => {
  //     if (loading || !hasMore) return
  //     setLoading(true)
  //     try {
  //       const response = await api.getComments(user.id, 5, offset)
  //       if (response.success) {
  //         setComments(prevMessages => [
  //           ...prevMessages,
  //           ...response.data.messages
  //         ])
  //         setHasMore(response.data.messages.length > 0)
  //         setOffset(prevOffset => prevOffset + response.data.messages.length)
  //       } else {
  //         showAlert(
  //           'error',
  //           `${response.data.message}: Please check your internet connection or try again later`
  //         )
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch messages', error.message)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   useFocusEffect(
  //     React.useCallback(() => {
  //       setMessages([])
  //       setOffset(0)
  //       setHasMore(true)
  //       fetchMessages()
  //     }, [user.id])
  //   )

  //   const renderItem = ({ item: message }) => {
  //     return (
  //     )
  //   }

  const unimplemented = () => {
    console.log('send')
  }

  return (
    <>
      {showHeader && (
        <HeaderStack title={me.username} user={me} hideFollowButton={false} />
      )}
      <View
        style={[
          styles.container,
          { paddingHorizontal: 20 },
          { maxWidth: 500 },
          { flexGrow: 1 },
          { alignSelf: 'center' }
        ]}
      >
        {/* <ChatBubble
          message={item.text}
          time={item.time}
          isSender={item.isSender}
        /> */}
        {userId ? (
          <Text>Will open conversation with user: {userId}</Text>
        ) : null}
        <ChatBubble
          message={'fsjbfisbfsjk bjggggbfsjkb jkb jkfbsjk bsjfb bsf bjsfb jsb'}
          time={'1 day ago'}
          isSender={false}
        />
        <ChatBubble
          message={
            'nsjkfhsh khfsjk hsjkfh hfj nsfjkn j fsjkh jk ksjksf jks k hsjkfh jksfhsjk hjksfh '
          }
          time={'1 day ago'}
          isSender={true}
        />
      </View>
      <SendInputBar
        onSend={unimplemented}
        placeholder="Send a message..."
        placeholderTextColor={colors.text}
      />
      {/* <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[styles.container, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={fetchMessages}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <Loader />}
        getItemLayout={(data, index) => ({
          length: index === 0 ? 700 : 40,
          offset: (index === 0 ? 0 : 700) + 40 * index,
          index
        })}
      /> */}
    </>
  )
}

export default MessageScreen
