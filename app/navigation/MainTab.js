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

  const tabScreens = [
    <Tab.Screen key="Home" name="Home" component={HomeScreen} />,
    <Tab.Screen key="Search" name="Search" component={SearchScreen} />
  ]

  if (isAuthenticated) {
    tabScreens.push(
      <Tab.Screen key="Chat" name="Chat" component={ChatScreen} />,
      <Tab.Screen key="Add" name="Add" component={AddScreen} />,
      <Tab.Screen key="Profile" name="Profile" component={ProfileScreen} />
    )
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          return (
            <MaterialIcons
              style={styles.icon}
              name={tabIcons[route.name]}
              size={32}
              color={color}
            />
          )
        },

        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.secondaryTint,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.card
        },
        headerShown: false,
        unmountOnBlur: true
        // tabBarBadge + tabBarBadgeStyle for notifications
      })}
    >
      {tabScreens}
    </Tab.Navigator>
  )
}

export default Tabs
