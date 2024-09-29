import React, { createContext, useReducer, useEffect, useCallback } from 'react'
import api from '@/utils/api'

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true
}

const AuthContext = createContext(initialState)

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const loadUser = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const tokens = await api.loadTokens()
    if (tokens) {
      const userResponse = await api.getMe()
      if (userResponse && userResponse.success) {
        dispatch({ type: 'LOGIN', payload: userResponse.data })
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    } else {
      dispatch({ type: 'LOGOUT' })
    }
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => {
    const tokenChangeCallback = () => {
      loadUser()
    }
    api.setOnTokenChangeCallback(tokenChangeCallback)

    return () => {
      api.setOnTokenChangeCallback(null)
    }
  }, [loadUser])

  const login = async credentials => {
    const response = await api.login(credentials)
    if (response.success) {
      dispatch({ type: 'LOGIN', payload: response.data.user })
    }
    return response
  }

  const logout = async () => {
    const response = await api.logout()
    if (response.success) {
      dispatch({ type: 'LOGOUT' })
    }
    return response
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
