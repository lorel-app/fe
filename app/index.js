import * as React from 'react'
import * as Sentry from '@sentry/react-native'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import ThemeContext from '@/components/ThemeContext'
import AppDarkTheme from '@/constants/AppDarkTheme'
import AppLightTheme from '@/constants/AppLightTheme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthProvider } from '@/utils/authContext'
import { WebSocketProvider } from '@/utils/websocket'
import { AlertProvider } from '@/hooks/useAlertModal'
import { ConfirmProvider } from '@/hooks/useConfirmModal'
import { FollowingProvider } from '@/hooks/useFollowingContext'
import Tabs from './navigation/MainTab'
import Header from './navigation/Header'
import BuyScreen from '@/app/screens/Buy'
import CommentScreen from '@/app/screens/Comment'
import UserScreen from '@/app/screens/User'
import UserPostsScreen from '@/app/screens/UserPosts'
import UserFollowersScreen from '@/app/screens/UserFollowers'
import MessageScreen from '@/app/screens/Message'
import EditProfileScreen from '@/app/screens/EditProfile'
import EditPostScreen from '@/app/screens/EditPost'
import SettingsScreen from '@/app/screens/Settings'
import AboutScreen from '@/app/screens_static/About'
import UserAgreementsScreen from './screens_static/UserAgreements'

if (['dev', 'prod'].includes(process.env.EXPO_PUBLIC_ENV)) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === 'prod' ? 0.1 : 1.0,
    profilesSampleRate: 1.0,
    environment: process.env.EXPO_PUBLIC_ENV,
    release: process.env.EXPO_PUBLIC_RELEASE,
    dist: null
  })
}

const Stack = createStackNavigator()

const app = function Index() {
  const [theme, setTheme] = React.useState('light')
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme')
        if (savedTheme) {
          setTheme(savedTheme)
        }
      } catch (error) {
        console.error('Failed to load theme from AsyncStorage', error)
      } finally {
        setIsReady(true)
      }
    }

    loadTheme()
  }, [])

  if (!isReady) {
    return null
  }

  const themeData = { theme, setTheme }
  return (
    <AuthProvider>
      <WebSocketProvider>
        <ThemeContext.Provider value={themeData}>
					<NavigationIndependentTree>
						<NavigationContainer
							navigationInChildEnabled={true}
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
												name="UserFollowers"
												component={UserFollowersScreen}
												options={{ headerShown: false }}
											/>
											<Stack.Screen
												name="Message"
												component={MessageScreen}
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
												name="About Lorel"
												component={AboutScreen}
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
					</NavigationIndependentTree>
        </ThemeContext.Provider>
      </WebSocketProvider>
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

// wrap the app with Sentry only if deployed
export default ['dev', 'prod'].includes(process.env.EXPO_PUBLIC_ENV)
  ? Sentry.wrap(app)
  : app
