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
import { ConfirmProvider } from '@/hooks/useConfirmModal'
import { FollowingProvider } from '@/hooks/useFollowingContext'
import Tabs from './navigation/MainTab'
import Header from './navigation/Header'
import BuyScreen from '@/app/screens/Buy'
import CommentScreen from '@/app/screens/Comment'
import UserScreen from '@/app/screens/User'
import UserPostsScreen from '@/app/screens/UserPosts'
import EditProfileScreen from '@/app/screens/EditProfile'
import EditPostScreen from '@/app/screens/EditPost'
import SettingsScreen from '@/app/screens/Settings'
import UserAgreementsScreen from './screens_static/UserAgreements'

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
            <ConfirmProvider>
              <FollowingProvider>
                <Stack.Navigator screenOptions={{ cardStyle: { flex: 1 } }}>
                  <Stack.Screen
                    name="MainTabs"
                    component={MainScreens}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Comment"
                    component={CommentScreen}
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
                  <Stack.Screen
                    name="UserPosts"
                    component={UserPostsScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="EditProfile"
                    component={EditProfileScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="EditPost"
                    component={EditPostScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="User Settings"
                    component={SettingsScreen}
                    options={{ headerShown: true }}
                  />
                  <Stack.Screen
                    name="User Agreements"
                    component={UserAgreementsScreen}
                    options={{ headerShown: true }}
                  />
                </Stack.Navigator>
              </FollowingProvider>
            </ConfirmProvider>
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
