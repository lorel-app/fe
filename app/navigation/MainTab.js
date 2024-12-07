import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import HomeScreen from '@/app/screens/Home'
import SearchScreen from '@/app/screens/Search'
import ChatScreen from '@/app/screens/Chat'
import AddScreen from '@/app/screens/Add'
import ProfileScreen from '@/app/screens/Profile'
import { useTheme } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
import AuthContext from '@/utils/authContext'
import { useWebSocket } from '@/utils/websocket'

const Tab = createBottomTabNavigator()
const tabIcons = {
  Home: 'home',
  Chat: 'mode-comment',
  Search: 'search',
  Add: 'add',
  Profile: 'person'
}

function Tabs() {
  const { colors } = useTheme()
  const styles = useGlobalStyles()
  const { isAuthenticated } = useContext(AuthContext)
  const { newChatMessages } = useWebSocket()
  const tabScreens = [
    <Tab.Screen key="Home" name="Home" component={HomeScreen} />,
    <Tab.Screen key="Search" name="Search" component={SearchScreen} />
  ]

  if (isAuthenticated) {
    tabScreens.push(
      <Tab.Screen
        key="Chat"
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarBadge:
            newChatMessages.length > 0 ? newChatMessages.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.tertiary,
            color: colors.tint,
            fontWeight: 500,
            fontSize: 10,
            height: 20,
            minWidth: 20,
            borderRadius: 10,
            justifyContent: 'center',
            alignContent: 'center',
            textAlign: 'center'
          }
        }}
      />,
      <Tab.Screen key="Add" name="Add" component={AddScreen} />,
      <Tab.Screen key="Profile" name="Profile" component={ProfileScreen} />
    )
  }

  return (
    <Tab.Navigator
      detachInactiveScreens={true}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          return (
            <MaterialIcons
              style={styles.icon}
              name={tabIcons[route.name]}
              size={34}
              color={color}
              aria-label={tabIcons[route.name]}
            />
          )
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.secondaryTint,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          padding: 0
        },
        headerShown: false
        // deprecated with expo sdk 52 - use useFocusEffect for now
        // unmountOnBlur: true
      })}
    >
      {tabScreens}
    </Tab.Navigator>
  )
}

export default Tabs
