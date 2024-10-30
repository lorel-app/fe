import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { Linking } from 'react-native'

const ResetPasswordScreen = () => {
  useEffect(() => {
    const handleUrl = url => {
      console.log('Received URL:', url)
      try {
        const parsedUrl = new URL(url)
        const queryParams = parsedUrl.searchParams.get('token') // This gets the entire query string
        console.log('Query parameters:', queryParams) // Logs everything after the '?'
      } catch (error) {
        console.error('Error parsing URL:', error)
      }
    }

    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL()
      if (initialUrl) {
        handleUrl(initialUrl)
      }
    }
    const linkingListener = Linking.addEventListener('url', ({ url }) =>
      handleUrl(url)
    )

    getInitialURL()

    return () => {
      linkingListener.remove()
    }
  }, [])

  return (
    <View>
      <Text>Reset Password Screen</Text>
    </View>
  )
}

export default ResetPasswordScreen
