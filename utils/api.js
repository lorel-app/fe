import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL

let onTokenChange = null
let accessToken = null
let refreshToken = null

const setOnTokenChangeCallback = callback => {
  onTokenChange = callback
}

const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

const setTokens = async (access, refresh) => {
  accessToken = access
  refreshToken = refresh

  try {
    if (accessToken) {
      await AsyncStorage.setItem('accessToken', accessToken)
      apiInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`
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
  } catch (e) {
    console.error('Failed to load tokens from storage', e)
  }
}

const getUserIdFromAccessToken = () => {
  if (!accessToken) return null
  const payload = JSON.parse(atob(accessToken.split('.')[1]))
  return payload.id
}

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

const getMe = async body => {
  const response = await apiInstance.get('/me', body)
  return response
}

const updateProfilePic = async file => {
  const formData = new FormData()
  formData.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.name
  })
  // not implemented on web - waiting for profile route
  const response = await apiInstance.put('me/display-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

const allPosts = async (limit = 10, offset = 0) => {
  const response = await apiInstance.get('/', {
    params: { limit, offset }
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

const addPost = async body => {
  const formData = new FormData()

  const scalars = ['type', 'caption', 'title', 'description', 'price']
  scalars.forEach(scalar => {
    if (body[scalar]) formData.append(scalar, body[scalar])
  })

  // tags not handles yet
  if (body.tags) {
    formData.append('tags', body.tags)
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

const allTags = async () => {
  const response = await apiInstance.get('/tag')
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
  getMe,
  updateProfilePic,
  allPosts,
  likePost,
  unlikePost,
  addPost,
  allTags,
  loadTokens,
  setOnTokenChangeCallback
}
