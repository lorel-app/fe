import React, { useEffect, useRef, useState, useContext } from 'react'
import { useTheme, useFocusEffect } from '@react-navigation/native'
import { FlatList, Text, KeyboardAvoidingView, Platform } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useAlertModal } from '@/hooks/useAlertModal'
import { useNavigation } from '@react-navigation/native'
import api from '@/utils/api'
import HeaderStack from '../navigation/HeaderStack'
import Post from '@/components/Post'
import SendInputBar from '@/components/SendInputBar'
import Comment from '@/components/Comment'
import Loader from '@/components/Loader'
import AuthContext from '@/utils/authContext'

const CommentScreen = ({ route }) => {
  const styles = useGlobalStyles()
  const { colors } = useTheme()
  const { post = {}, user = {}, showHeader = true } = route.params || {}
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const showAlert = useAlertModal()
  const { user: me } = useContext(AuthContext)
  const navigation = useNavigation()

  const fetchComments = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const response = await api.getComments(post.id, 5, offset)
      if (response.success) {
        setComments(prevComments => [
          ...prevComments,
          ...response.data.comments
        ])
        setHasMore(response.data.comments.length > 0)
        setOffset(prevOffset => prevOffset + response.data.comments.length)
        // setTimeout(() => {
        //   flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })
        // }, 100)
      } else {
        showAlert(
          'error',
          `Please check your internet connection or try again later`
        )
      }
    } catch (error) {
      console.error('Failed to fetch comments', error.message)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      setComments([])
      setOffset(0)
      fetchComments()
    }, [post.id])
  )

  const flatListRef = useRef(null)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    if (comments.length > 0 && comments.length <= 5 && !hasScrolled) {
      flatListRef.current?.scrollToEnd({ animated: true })
      setHasScrolled(true)
    }
  }, [comments])

  const handleComment = async myComment => {
    if (!me) {
      showAlert('error', 'Please log in first')
      return
    } else {
      setIsSending(true)
      const response = await api.addComment(post.id, { content: myComment })
      if (response.success) {
        const newComment = response.data.comment
        setComments(prevComments => [newComment, ...prevComments]) // Prepend new comment to the list
        setOffset(prevOffset => prevOffset + 1)
        setIsSending(false)
      } else {
        showAlert('error', response.data.message)
        setIsSending(false)
      }
    }
  }

  const handleDeleteComment = commentId => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId)
    )
  }

  const handleDeletePost = async postId => {
    const response = await api.deletePost(postId)
    if (response.success) {
      navigation.navigate('Profile')
    }
  }

  const renderItem = ({ item: comment }) => {
    return (
      <Comment
        comment={comment}
        key={comment.id}
        onDelete={handleDeleteComment}
      />
    )
  }

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
    style={{ flex: 1 }}
    keyboardShouldPersistTaps="handled"
  >
      {showHeader && <HeaderStack title={'comments'} hideFollowButton={true} />}
      <FlatList
        ref={flatListRef}
        data={comments}
        renderItem={renderItem}
        // ?
        maxToRenderPerBatch={5}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[styles.container, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={fetchComments}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <Post
            post={post}
            hideCommentButton={true}
            onDeletePost={handleDeletePost}
          />
        }
        ListHeaderComponentStyle={styles.post}
        ListEmptyComponent={
          <Text style={[styles.textCenter, { marginVertical: 30 }]}>
            No comments yet
          </Text>
        }
        ListFooterComponent={loading && <Loader />}
        getItemLayout={(data, index) => ({
          length: index === 0 ? 700 : 40,
          offset: (index === 0 ? 0 : 700) + 40 * index,
          index
        })}
      />
      <SendInputBar
        onSend={handleComment}
        placeholder="Add your comment..."
        placeholderTextColor={colors.text}
        isSending={isSending}
      />
    </KeyboardAvoidingView>
  )
}

export default CommentScreen
