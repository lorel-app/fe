import * as React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import ThemeContext from '@/components/ThemeContext'
import AppDarkTheme from '@/constants/AppDarkTheme'
import AppLightTheme from '@/constants/AppLightTheme'
import { useColorScheme } from '@/hooks/useColorScheme'
import { AuthProvider } from '@/utils/authContext'
import { AlertProvider } from '@/hooks/useAlertModal'
import { FollowingProvider } from '@/hooks/useFollowingContext'
import Tabs from './navigation/MainTab'
import Header from './navigation/Header'
import BuyScreen from '@/app/screens/Buy'
import UserScreen from '@/app/screens/User'

const Stack = createStackNavigator()

export default function Index() {
  const colorScheme = useColorScheme()
  const [theme, setTheme] = React.useState(colorScheme)
  const themeData = { theme, setTheme }

  return (
    <AuthProvider>
      <ThemeContext.Provider value={themeData}>
        <NavigationContainer
          independent={true}
          theme={theme === 'light' ? AppLightTheme : AppDarkTheme}
        >
          <AlertProvider>
            <FollowingProvider>
              <Stack.Navigator screenOptions={{ cardStyle: { flex: 1 } }}>
                <Stack.Screen
                  name="MainTabs"
                  component={MainScreens}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Buy"
                  component={BuyScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="User"
                  component={UserScreen}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </FollowingProvider>
          </AlertProvider>
          <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
        </NavigationContainer>
      </ThemeContext.Provider>
    </AuthProvider>
  )
}

const MainScreens = () => {
  return (
    <>
      <Header />
      <Tabs />
    </>
  )
}
