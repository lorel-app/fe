import React, { useRef, useEffect, useState, useContext } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { FlatList } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import { useTheme } from '@react-navigation/native'
import { useAlertModal } from '@/hooks/useAlertModal'
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
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const showAlert = useAlertModal()
  const { user: me } = useContext(AuthContext)

  const scrollViewRef = useRef(null)

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [])

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
      } else {
        showAlert(
          'error',
          `${response.data.message}: Please check your internet connection or try again later`
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
      fetchComments()
      console.log(post.id)
    }, [post.id])
  )

  const handleComment = async myComment => {
    if (!me) {
      showAlert('error', 'Please log in first')
      return
    } else {
      const response = await api.addComment(post.id, { content: myComment })
      if (response.success) {
        console.log(response)
        //const newComment = response.data.comment
        //setComments(prevComments => [...prevComments, newComment])
      } else {
        showAlert('error', response.data.message)
      }
    }
  }

  const handleDeleteComment = commentId => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId)
    )
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
    <>
      {showHeader && (
        <HeaderStack title={'comments'} user={user} hideFollowButton={true} />
      )}
      <FlatList
        testID={'scrollable-feed'}
        data={comments}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={fetchComments}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={<Post post={post} hideCommentButton={true} />}
        ListHeaderComponentStyle={styles.post}
        ListFooterComponent={loading && <Loader />}
      />
      <SendInputBar
        onSend={handleComment}
        placeholder="Add your comment..."
        placeholderTextColor={colors.text}
      />
    </>
  )
}

export default CommentScreen
