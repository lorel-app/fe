import React, { useState, useContext, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import ThemeContext from './ThemeContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

const ButtonSwitch = () => {
  const { setTheme, theme } = useContext(ThemeContext)
  const [isEnabled, setIsEnabled] = useState(theme === 'dark')
  const styles = useGlobalStyles()

  useEffect(() => {
    const saveThemeToStorage = async () => {
      try {
        await AsyncStorage.setItem('theme', theme)
      } catch (error) {
        console.error('Failed to save theme to AsyncStorage', error)
      }
    }
    saveThemeToStorage()
  }, [theme])

  const toggleSwitch = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setIsEnabled(prevState => !prevState)
    setTheme(newTheme)
  }

  return (
    <View>
      <TouchableOpacity
        style={[styles.switch, isEnabled ? styles.switchOn : styles.switchOff]}
        onPress={toggleSwitch}
      >
        <View
          style={[styles.thumb, isEnabled ? styles.thumbOn : styles.thumbOff]}
        />
      </TouchableOpacity>
    </View>
  )
}

export default ButtonSwitch
