import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL

let onTokenChange = () => {}
let accessToken = null
let refreshToken = null
let refreshTimeout = null

const setOnTokenChangeCallback = callback => {
  if (typeof callback === 'function') {
    onTokenChange = callback
  } else {
    console.warn('onTokenChange callback provided is not a function')
  }
}

const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const decodeJWT = token => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
    console.error('Failed to decode JWT', error)
    return null
  }
}

const scheduleTokenRefresh = expirationTime => {
  clearTimeout(refreshTimeout)
  const currentTime = Math.floor(Date.now() / 1000)
  const refreshIn = expirationTime - currentTime - 120

  if (refreshIn > 0) {
    refreshTimeout = setTimeout(async () => {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        scheduleTokenRefresh(refreshed.expirationTime)
      }
    }, refreshIn * 1000)
  }
}

const refreshAccessToken = async () => {
  if (!accessToken) {
    return null
  }
  try {
    const client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const decoded = decodeJWT(accessToken)
    const userId = decoded ? decoded.id : null
    const response = await client.post('/auth/refresh', {
      userId,
      refreshToken
    })

    if (response.status === 200) {
      const newAccessToken = response.data.accessToken
      const newDecoded = decodeJWT(newAccessToken)
      if (newDecoded && newDecoded.exp) {
        await setTokens(newAccessToken, refreshToken)
        onTokenChange()
        return { expirationTime: decoded.exp }
      }
    } else {
      console.error('Failed to refresh access token', response)
      return null
    }
  } catch (error) {
    console.error('Error refreshing access token', error)
    return null
  }
}

// prev SetTokens..
//       apiInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`
//     } else {
//       await AsyncStorage.removeItem('accessToken')
//       delete apiInstance.defaults.headers['Authorization']
//     }
//     if (refreshToken) {
//       await AsyncStorage.setItem('refreshToken', refreshToken)
//     } else {
//       await AsyncStorage.removeItem('refreshToken')
//     }
//   } catch (e) {
//     console.error('Failed to save tokens to storage', e)
//   }
// }

const setTokens = async (access, refresh) => {
  accessToken = access
  refreshToken = refresh

  try {
    if (accessToken) {
      await AsyncStorage.setItem('accessToken', accessToken)
      apiInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`
      const decoded = decodeJWT(accessToken)
      if (decoded && decoded.exp) {
        scheduleTokenRefresh(decoded.exp)
      }
    } else {
      await AsyncStorage.removeItem('accessToken')
      delete apiInstance.defaults.headers['Authorization']
    }
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken)
    } else {
      await AsyncStorage.removeItem('refreshToken')
    }
  } catch (e) {
    console.error('Failed to save tokens to storage', e)
  }
}

const loadTokens = async () => {
  try {
    if (typeof window === 'undefined') return null
    const storedAccessToken = await AsyncStorage.getItem('accessToken')
    const storedRefreshToken = await AsyncStorage.getItem('refreshToken')

    if (storedAccessToken && storedRefreshToken) {
      await setTokens(storedAccessToken, storedRefreshToken)
      return {
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken
      }
    } else {
      return null
    }
  } catch (error) {
    console.error('Failed to load tokens from storage', error)
  }
}

// Extract user ID from access token
const getUserIdFromAccessToken = () => {
  if (!accessToken) return null
  const payload = decodeJWT(accessToken)
  return payload ? payload.id : null
}

apiInstance.interceptors.response.use(
  function (response) {
    return {
      success: true,
      status: response.status || 200,
      data: response.data || null
    }
  },
  async function (originalRequest) {
    if (!originalRequest.response) {
      // catches network error
      return {
        success: false,
        status: null,
        data: originalRequest
      }
    }
    if (originalRequest.response.status === 401) {
      const client = axios.create({
        baseURL: BASE_URL,
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: status => true
      })
      const userId = getUserIdFromAccessToken()
      const response = await client.post('/auth/refresh', {
        userId,
        refreshToken
      })
      if (!response.status === 200) {
        return {
          success: false,
          status: response.status,
          data: response.data || null
        }
      }
      const newAccessToken = response.data.accessToken
      await setTokens(newAccessToken, refreshToken)
      // WIP - refresh before !200
      onTokenChange()
      client.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`
      try {
        const retryResponse = await client({
          method: originalRequest.config.method,
          url: originalRequest.config.url,
          body: originalRequest.config.body,
          validateStatus: status => status <= 299
        })
        return {
          success: true,
          status: retryResponse.status,
          data: retryResponse.data || null
        }
      } catch (error) {
        return {
          success: false,
          status: error.response.status,
          data: error.response.data || null
        }
      }
    } else {
      return {
        success: false,
        status: originalRequest.response.status,
        data: originalRequest.response.data || null
      }
    }
  }
)

const signUp = async body => {
  const response = await apiInstance.post('/auth/signup', body)
  return response
}

const login = async body => {
  try {
    const response = await apiInstance.post('/auth/login', body)
    if (response.success) {
      const { accessToken, refreshToken } = response.data
      await setTokens(accessToken, refreshToken)
    }
    return response
  } catch (error) {
    return error
  }
}

const logout = async () => {
  const response = await apiInstance.post('/auth/logout')
  if (response.success) {
    await setTokens(null, null)
    onTokenChange()
    return { success: true }
  } else {
    return { success: false, error: response.error }
  }
}

const sendVerificationEmail = async body => {
  const response = await apiInstance.post('/verify/email', body)
  return response
}

const sendVerificationPhone = async body => {
  const response = await apiInstance.post('/verify/phone', body)
  return response
}

const verifyEmail = async body => {
  const response = await apiInstance.post('/verify/email/check', body)
  return response
}

const verifyPhone = async body => {
  const response = await apiInstance.post('/verify/phone/check', body)
  return response
}

const sendResetPasswordEmail = async body => {
  const response = await apiInstance.post('/auth/reset-password', body)
  return response
}

const resetPassword = async body => {
  const response = await apiInstance.patch('/auth/reset-password', body)
  return response
}

const changePassword = async body => {
  const response = await apiInstance.patch('/auth/change-password', body)
  return response
}

const getMe = async body => {
  const response = await apiInstance.get('/me', body)
  return response
}

const deleteMe = async () => {
  const response = await apiInstance.delete('/me')
  if (response.success) {
    await setTokens(null, null)
    onTokenChange()
    return response
  }
}

const getUser = async userId => {
  const response = await apiInstance.get(`user/${userId}`)
  return response
}

const editPreferences = async body => {
  const response = await apiInstance.patch('/preferences', body)
  return response
}

const editProfile = async body => {
  const response = await apiInstance.patch('/profile', body)
  return response
}

const addProfileLink = async body => {
  const response = await apiInstance.patch('/profile/link', body)
  return response
}

const deleteProfileLink = async body => {
  const response = await apiInstance.delete('/profile/link', { data: body })
  return response
}

// Not platform specific yet - just works for web
const updateProfilePic = async file => {
  const response = await apiInstance.put('me/display-picture', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

// Not platform specific yet - just works for web
const updateCoverPic = async file => {
  const response = await apiInstance.put('me/cover-picture', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

const deleteProfilePic = async () => {
  const response = await apiInstance.delete('/me/display-picture')
  return response
}

const deleteCoverPic = async () => {
  const response = await apiInstance.delete('/me/cover-picture')
  return response
}

const allPosts = async (limit = 10, offset = 0) => {
  const response = await apiInstance.get('/', {
    params: { limit, offset }
  })
  return response
}

const userPosts = async (userId, options) => {
  const defaults = {
    limit: 12,
    offset: 0,
    postType: 'ALL'
  }
  const opts = { ...defaults, ...options }
  const response = await apiInstance.get(`/post/${userId}`, {
    params: opts
  })
  return response
}

const likePost = async postId => {
  const response = await apiInstance.post(`like/${postId}`)
  return response
}

const unlikePost = async postId => {
  const response = await apiInstance.delete(`like/${postId}`)
  return response
}

const deletePost = async postId => {
  const response = await apiInstance.delete(`post/${postId}`)
  return response
}

const getComments = async (postId, limit = 20, offset = 0) => {
  const response = await apiInstance.get(`comment/${postId}`, {
    params: { limit, offset }
  })
  return response
}

const addComment = async (postId, body) => {
  const response = await apiInstance.post(`comment/${postId}`, body)
  return response
}

const deleteComment = async commentId => {
  const response = await apiInstance.delete(`comment/${commentId}`)
  return response
}

const getFollowers = async (userId, options) => {
  const defaults = {
    limit: 12,
    offset: 0,
    relationship: 'following'
  }
  const opts = { ...defaults, ...options }
  const response = await apiInstance.get(`follower/${userId}`, {
    params: opts
  })
  return response
}

const followUser = async userId => {
  const response = await apiInstance.post(`follower/${userId}`)
  return response
}

const unfollowUser = async userId => {
  const response = await apiInstance.delete(`follower/${userId}`)
  return response
}

const addPost = async body => {
  const formData = new FormData()

  const scalars = ['type', 'caption', 'title', 'description', 'price']
  scalars.forEach(scalar => {
    if (body[scalar]) formData.append(scalar, body[scalar])
  })

  if (Array.isArray(body.tags)) {
    body.tags.forEach(tag => {
      formData.append('tags', tag)
    })
  }

  if (Array.isArray(body.media)) {
    body.media.forEach(file => {
      if (Platform.OS === 'web') {
        formData.append('files', file)
      } else {
        // not tested on ios
        formData.append('files', {
          uri: file.uri,
          type: file.type,
          name: file.name
        })
      }
    })
  }
  const response = await apiInstance.post('/post', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

const editPost = async (postId, body) => {
  const response = await apiInstance.patch(`post/${postId}`, body)
  return response
}

const allTags = async () => {
  const response = await apiInstance.get('/tag')
  return response
}

const allChats = async (limit = 12, offset = 0) => {
  const response = await apiInstance.get('/chat', {
    params: { limit, offset }
  })
  return response
}

const getChat = async (userId, limit = 12, offset = 0) => {
  const response = await apiInstance.get(`chat/user/${userId}`, {
    params: { limit, offset }
  })
  return response
}

const sendReport = async body => {
  const response = await apiInstance.post('/report', body)
  return response
}

loadTokens()

export default {
  signUp,
  login,
  logout,
  sendVerificationEmail,
  sendVerificationPhone,
  verifyEmail,
  verifyPhone,
  sendResetPasswordEmail,
  resetPassword,
  changePassword,
  getMe,
  deleteMe,
  getUser,
  editPreferences,
  editProfile,
  addProfileLink,
  deleteProfileLink,
  updateProfilePic,
  deleteProfilePic,
  updateCoverPic,
  deleteCoverPic,
  allPosts,
  userPosts,
  likePost,
  unlikePost,
  deletePost,
  getComments,
  addComment,
  deleteComment,
  getFollowers,
  followUser,
  unfollowUser,
  addPost,
  editPost,
  allTags,
  allChats,
  getChat,
  sendReport,
  loadTokens,
  setOnTokenChangeCallback
}
