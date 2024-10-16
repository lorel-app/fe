import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import HomeScreen from '@/app/screens/Home'
import SearchScreen from '@/app/screens/Search'
import AddScreen from '@/app/screens/Add'
import ProfileScreen from '@/app/screens/Profile'
import { useTheme } from '@react-navigation/native'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'

const Tab = createBottomTabNavigator()
const tabIcons = {
  Home: 'home',
  Search: 'search',
  Add: 'add',
  Profile: 'person'
}

function Tabs() {
  const { colors } = useTheme()
  const styles = useGlobalStyles()
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default Tabs
