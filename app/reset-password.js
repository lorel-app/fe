import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Linking } from 'react-native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import ButtonIcon from '@/components/ButtonIcon'
import Spacer from '@/components/Spacer'
import { Colors } from '@/constants/Colors'
import api from '@/utils/api'

const ResetPasswordScreen = () => {
  const styles = useGlobalStyles()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)

  const goToHomeLink = process.env.EXPO_PUBLIC_APP_URL
  const openHomeLink = () => {
    Linking.openURL(goToHomeLink).catch(err =>
      console.error('Failed to open link:', err)
    )
  }

  useEffect(() => {
    const handleUrl = url => {
      try {
        const parsedUrl = new URL(url)
        const queryParams = parsedUrl.searchParams.get('token')
        if (!queryParams || queryParams.length < 64) {
          window.alert('Invalid link')
          openHomeLink()
        } else {
          setToken(queryParams)
        }
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

  const resetPassword = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,64}$/
    if (!passwordRegex.test(password)) {
      window.alert(
        'Passwords must be at least 8 characters long and contain at least 1 uppercase letter, lowercase letter, and number'
      )
      return
    }

    if (password !== confirmPassword) {
      window.alert('Passwords do not match')
      return
    }

    const response = await api.resetPassword({ token, password })

    if (response.success) {
      openHomeLink()
    } else {
      window.alert(
        'Something went wrong, please try again - the link likely expired'
      )
      openHomeLink()
    }
  }

  return token ? (
    <View style={styles.containerFull}>
      <Text style={styles.title}>
        Once your password is reset, we will take you back to the home screen
      </Text>
      <Spacer />
      <View style={{ alignSelf: 'center' }}>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor={Colors.text}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            maxLength={64}
            multiline={false}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.black}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!passwordVisible}
            maxLength={64}
            multiline={false}
          />
        </View>
        <TouchableOpacity
          style={styles.rowSpan}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Text>{passwordVisible ? 'hide password' : 'show password'}</Text>
          <ButtonIcon
            onPress={() => setPasswordVisible(!passwordVisible)}
            iconName={passwordVisible ? 'visibility-off' : 'visibility'}
            iconColor={Colors.blue}
            iconSize={24}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: Colors.blue },
          { width: 200 }
        ]}
        onPress={resetPassword}
      >
        <Text style={[styles.buttonText, { color: Colors.white }]}>
          Confirm
        </Text>
      </TouchableOpacity>
      <Spacer />
      <TouchableOpacity style={styles.link} onPress={openHomeLink}>
        <Text style={[styles.buttonText, { color: Colors.blueDark }]}>
          Go to Lorel Home
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={[styles.containerFull, { backgroundColor: Colors.white }]}>
      <Text
        style={[{ color: Colors.blue }, { fontSize: 100 }, { opacity: 0.5 }]}
      >
        404
      </Text>
      <Text style={[styles.title, { color: Colors.black }]}>
        Whoops! Invalid link
      </Text>
      <Spacer />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: Colors.blueDark },
          { width: 200 }
        ]}
        onPress={openHomeLink}
      >
        <Text style={[styles.buttonText, { color: Colors.white }]}>
          Go to Lorel Home
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ResetPasswordScreen
