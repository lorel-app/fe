import React, { useState, useContext } from 'react'
import { Switch, View } from 'react-native'
import ThemeContext from './ThemeContext'

const ButtonSwitch = () => {
  const { setTheme, theme } = useContext(ThemeContext)
  const [isEnabled, setIsEnabled] = useState(theme === 'dark')

  const toggleSwitch = () => {
    setIsEnabled(prevState => !prevState)
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <View>
      <Switch value={isEnabled} onValueChange={toggleSwitch} />
    </View>
  )
}

export default ButtonSwitch
