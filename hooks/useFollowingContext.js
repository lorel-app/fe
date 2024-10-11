import React, { createContext, useState, useContext } from 'react'
import api from '@/utils/api'

const FollowingContext = createContext()

export const FollowingProvider = ({ children }) => {
  const [userFollows, setUserFollows] = useState({})

  const followUser = async userId => {
    try {
      const response = await api.followUser(userId)
      if (response.success) {
        setUserFollows(prev => ({
          ...prev,
          [userId]: true
        }))
      }
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const unfollowUser = async userId => {
    try {
      const response = await api.unfollowUser(userId)
      if (response.success) {
        setUserFollows(prev => ({
          ...prev,
          [userId]: false
        }))
      }
      return response
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  return (
    <FollowingContext.Provider
      value={{ userFollows, followUser, unfollowUser }}
    >
      {children}
    </FollowingContext.Provider>
  )
}

export const useFollowingContext = () => useContext(FollowingContext)
