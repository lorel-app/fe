import { useState, useRef } from 'react'
import api from '@/utils/api'

const useFetchUserPosts = (userId, postType) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const postsFetched = useRef(false)

  const fetchPosts = async () => {
    if (!hasMore || postsFetched.current) return
    setLoading(true)
    postsFetched.current = true

    try {
      const response = await api.userPosts(userId, {
        offset,
        postType
      })

      if (response.success) {
        setPosts(prevPosts => [...prevPosts, ...response.data.posts])
        setHasMore(response.data.posts.length > 0)
        setOffset(prevOffset => prevOffset + response.data.posts.length)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error(`Failed to fetch ${postType} posts`, error.message)
    } finally {
      setLoading(false)
    }
  }

  return { posts, loading, fetchPosts, hasMore }
}

export default useFetchUserPosts
