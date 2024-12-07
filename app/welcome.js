import React from 'react'
import {
  NavigationContainer,
  NavigationIndependentTree
} from '@react-navigation/native'
import DrawerNavigator from './web_only_navigation/Navbar'
import ThemeContext from '@/components/ThemeContext'
import AppDarkTheme from '@/constants/AppDarkTheme'
import AppLightTheme from '@/constants/AppLightTheme'
import { useColorScheme } from '@/hooks/useColorScheme'
import { StatusBar } from 'expo-status-bar'

const LandingPage = () => {
  const colorScheme = useColorScheme()
  const [theme, setTheme] = React.useState(colorScheme)
  const themeData = { theme, setTheme }

  return (
    <ThemeContext.Provider value={themeData}>
      <NavigationIndependentTree>
        <NavigationContainer
          independent={true}
          theme={theme === 'light' ? AppLightTheme : AppDarkTheme}
        >
          <DrawerNavigator />
          <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
        </NavigationContainer>
      </NavigationIndependentTree>
    </ThemeContext.Provider>
  )
}

export default LandingPage
