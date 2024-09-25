import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import ThemeContext from './ThemeContext'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

const ButtonSwitch = () => {
  const { setTheme, theme } = useContext(ThemeContext)
  const [isEnabled, setIsEnabled] = useState(theme === 'dark')
  const styles = useGlobalStyles()

  const toggleSwitch = () => {
    setIsEnabled(prevState => !prevState)
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <View style={styles.container}>
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
