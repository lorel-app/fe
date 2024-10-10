import React, { createContext, useState, useContext } from 'react'
import api from '@/utils/api'

const FollowingContext = createContext()

export const FollowingProvider = ({ children }) => {
  const [userFollows, setUserFollows] = useState({})

  const followUser = async userId => {
    try {
      await api.followUser(userId)
      setUserFollows(prev => ({
        ...prev,
        [userId]: true
      }))
    } catch (error) {
      setUserFollows(prev => ({
        ...prev,
        [userId]: false
      }))
    }
  }

  const unfollowUser = async userId => {
    try {
      await api.unfollowUser(userId)
      setUserFollows(prev => ({
        ...prev,
        [userId]: false
      }))
    } catch (error) {
      setUserFollows(prev => ({
        ...prev,
        [userId]: true
      }))
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
