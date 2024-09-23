import * as React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AppDarkTheme from '@/constants/AppDarkTheme'
import AppLightTheme from '@/constants/AppLightTheme'
import ThemeContext from '@/components/ThemeContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useTheme } from '@react-navigation/native'
import { AuthProvider } from '@/utils/authContext'
import { AlertProvider } from '@/hooks/useAlertModal'
import Tabs from './navigation/MainTab'
import Header from './navigation/Header'
import BuyScreen from '@/app/screens/Buy'

const Stack = createStackNavigator()

export default function Index() {
  const colorScheme = useColorScheme()
  const [theme, setTheme] = React.useState(colorScheme)
  const themeData = { theme, setTheme }
  const { colors } = useTheme()

  return (
    <AuthProvider>
      <ThemeContext.Provider value={themeData}>
        <AlertProvider>
          <NavigationContainer
            independent={true}
            theme={theme === 'light' ? AppLightTheme : AppDarkTheme}
          >
            <Stack.Navigator>
              <Stack.Screen
                name="MainTabs"
                component={MainScreens}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Buy"
                component={BuyScreen}
                options={{
                  headerShown: true,
                  title: '',
                  headerStyle: {
                    // theming issue
                    backgroundColor: colors.card
                  },
                  headerTintColor: colors.primary,
                  headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 18
                  },
                  headerBackTitleVisible: false
                }}
              />
            </Stack.Navigator>
            <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
          </NavigationContainer>
        </AlertProvider>
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
